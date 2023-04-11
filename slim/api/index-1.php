<?php
include_once "vars.php";
include_once "connect.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$url = "https://ked.priority-software.com.cy/odata/Priority/tabula.ini/efk/B2B_LOGPART";

try {
    $parts = json_decode(connect_api($url, $user, $pass));

    $prods = [];

    foreach($parts->value as $part) {
        $part_id = $part->PARTNAME;
        $expiry_date = "";
        $stock = 0;
        $inventory_url = "https://ked.priority-software.com.cy/odata/Priority/tabula.ini/efk/B2B_PARTBAL?\$filter=PARTNAME%20eq%20'$part_id'";
        $part_inventory = json_decode(connect_api($inventory_url, $user, $pass));
        $res = $part_inventory->value;

        foreach($res as $inventory) {
            if($inventory->DEX_STZONECODE =="VI" ) {
                $expiry_date = $inventory->EXPIRYDATE;
                $stock = $inventory->TBALANCE;
            }
        }

        if($expiry_date != "" && $stock != 0) {
            $prod = [
                'code' => $part_id,
                'description' => $part->PARTDES,
                'availableQuantity' => $stock,
                'expiry_date' => $expiry_date,
                'brand' => $part->DEXT_BRAND,
                'category' => $part->SPEC19,
                'active_substance' => $part->SPEC1,
                'pharmacy_service_code' => $part->SPEC14,
                'wholeSalePrice' => $part->WSPLPRICE,
                'retailPrice' => $part->VATPRICE
            ];

            array_push($prods, $prod);
        }
        
    }
    $products = json_encode($prods);
    echo $products;
} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}
