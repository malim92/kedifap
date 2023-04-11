<?php

$strJsonFileContents = file_get_contents("api/customer api.json");
$array = json_decode($strJsonFileContents, true);
var_dump($array);
try {
    $pdo = new PDO('mysql:host=95.216.75.254;dbname=kedifapportal_db', 'kedifapportal_admin', 'G)h2_6{q#ihu');

    $stmt = $pdo->prepare('INSERT INTO customers (id, cust_num, cust_name, active) VALUES (:id, :cust_num, :cust_name, :active)');
    foreach ($array["value"] as $row) {
        var_dump($row);
        //foreach ($values as  $value) {
            // $stmt->execute([
            //     'id' => $value['PHONENUM'],
            //     'cust_num' => $value['CUSTNAME'],
            //     'cust_name' => $value['CUSTDES'],
            //     'active' => $value['ACTIVEFLAG']
            // ]);
            //var_dump($value); // show contents
            // Bind parameters
            // print_r("$row[PHONENUM] + $row[CUSTNAME] + $row[CUSTDES]+ $row[ACTIVEFLAG] ");
            $row['ACTIVEFLAG'] = ($row['ACTIVEFLAG'] == 'Y') ? 1 : 0;

            $stmt->bindParam(':id', $row['GUID']);
            $stmt->bindParam(':cust_num', $row['CUSTNAME']);
            $stmt->bindParam(':cust_name', $row['CUSTDES']);
            $stmt->bindParam(':active', $row['ACTIVEFLAG']);
            $stmt->execute();
            //$stmt->rowCount();
            //print_r($stmt->rowCount()); 
        //}
    }
} catch (PDOException $e) {
    // handle the exception, e.g. log the error or show a user-friendly message
    echo "Error inserting data: " . $e->getMessage();
}

//var_dump($array["value"][0]['PHONENUM']);
//connect_api($url, $user, $pass);