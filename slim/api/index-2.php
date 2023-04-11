<?php
include_once "../config/vars.php";
include_once "../config/connect.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$url = "https://server1.kedifap.com:8082/PriorityAPI/api/Suppliers/GetBySupplierCode/V1216";

$products = connect_api($url, $user, $pass);

echo $products;
