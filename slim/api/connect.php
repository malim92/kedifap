<?php

function connect_api($url, $user, $pass) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_TIMEOUT, 90);   

    $headers = array(
        'Content-Type: application/json',
        'Authorization: Basic '. base64_encode("$user:$pass")
        );
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $results = curl_exec($ch);
    print_r('$results');print_r($results);
    if(!$results){
        // die('Error: "' . curl_error($ch) . '" - Code: ' . curl_errno($ch));
        $error = 'Error: "' . curl_error($ch) . '" - Code: ' . curl_errno($ch);
        return $error;
    } else {       
        // $results = json_decode($results, true);
        return $results;
    }
}

