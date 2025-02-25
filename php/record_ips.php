<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/autoload.php';

$file = 'php/visitors_ips.json';

// Функция для получения реального IP-адреса
function getUserIP()
{
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim(end($ips));
    } else {
        return $_SERVER['REMOTE_ADDR'];
    }
}

// получение страны, города и провайдера
function getGeoInfo($ip)
{
    $url = "http://ip-api.com/json/{$ip}?fields=status,country,city,isp";
    $response = file_get_contents($url);
    return json_decode($response, true);
}

// определение ОС
function getOS($user_agent)
{
    $os_array = [
        '/windows nt 10/i'     => 'Windows 10',
        '/windows nt 6.3/i'     => 'Windows 8.1',
        '/macintosh|mac os x/i' => 'Mac OS X',
        '/linux/i'              => 'Linux',
        '/android/i'            => 'Android'
    ];
    foreach ($os_array as $regex => $value) {
        if (preg_match($regex, $user_agent)) {
            return $value;
        }
    }
    return "Unknown OS";
}

$ip_address = getUserIP();
$visit_time = date('Y-m-d H:i:s');
$user_agent = $_SERVER['HTTP_USER_AGENT'];
$os = getOS($user_agent);
$referer = $_SERVER['HTTP_REFERER'] ?? 'Direct Visit';
$screen_resolution = $_GET['screen'] ?? 'Unknown';

// получение геоданных
$geoInfo = getGeoInfo($ip_address);
$country = $geoInfo['country'] ?? 'Unknown';
$city = $geoInfo['city'] ?? 'Unknown';
$isp = $geoInfo['isp'] ?? 'Unknown';

if (file_exists($file)) {
    $data = json_decode(file_get_contents($file), true);
    if (!is_array($data)) {
        $data = [];
    }
} else {
    $data = [];
}

if (count($data) > 30) {
    $data = [];
}

// новый визит
$data[] = [
    'ip' => $ip_address,
    'time' => $visit_time,
    'country' => $country,
    'city' => $city,
    'isp' => $isp,
    'os' => $os,
    'referer' => $referer,
    'screen' => $screen_resolution
];

file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);

echo "IP записан: $ip_address";

$mail = new PHPMailer(true);
try {
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'btair04@gmail.com';
    $mail->Password   = 'spmq ewhf ylzs yalz';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->setFrom('btair04@gmail.com', 'Visitor Tracker');
    $mail->addAddress('baurzhan21@inbox.ru', 'Tair');

    $mail->CharSet = 'UTF-8';
    $mail->Subject = 'Новый визит на сайт';
    $mail->Body    = "Новый визит:\n\n"
        . "IP: $ip_address\n"
        . "Страна: $country\n"
        . "Город: $city\n"
        . "Провайдер: $isp\n"
        . "ОС: $os\n"
        . "Реферер: $referer\n"
        . "Разрешение экрана: $screen_resolution\n"
        . "Время визита: $visit_time\n";

    // Отправка
    $mail->send();
    echo "Сообщение отправлено!";
} catch (Exception $e) {
    echo "Ошибка при отправке: {$mail->ErrorInfo}";
}
