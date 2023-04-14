    <?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

    $strJsonFileContents = file_get_contents("./data.json");
    $array = json_decode($strJsonFileContents, true);

    try {
        $pdo = new PDO('mysql:host=95.216.75.254;dbname=kedifapportal_db', 'kedifapportal_admin', 'naLf;O]9MkKF');

        $stmt = $pdo->prepare('INSERT INTO parts (PARTNAME, PARTDES, SPEC19, DEXT_NARCOTIC,  DEXT_ACTIVE,  SUPNAME, DEXT_IMPORTERNAME, DEXT_GHS, SPEC14, DEXT_LIQUID, DEXT_FRAGILE, DEXT_BRAND, CUSTNAME, SPEC1, DEXT_CMVO, DEXT_PARTBARCODE, BARCODE, DEXT_CSPOLICYCODE, DEXT_SUPPOLICYCODE, UDATE, VATPRICE,  WSPLPRICE ) VALUES (:PARTNAME,:PARTDES,:SPEC19,:DEXT_NARCOTIC,:DEXT_ACTIVE,:SUPNAME,:DEXT_IMPORTERNAME,:DEXT_GHS,:SPEC14,:DEXT_LIQUID,:DEXT_FRAGILE,:DEXT_BRAND,:CUSTNAME,:SPEC1,:DEXT_CMVO,:DEXT_PARTBARCODE,:BARCODE,:DEXT_CSPOLICYCODE,:DEXT_SUPPOLICYCODE,:UDATE,:VATPRICE,:WSPLPRICE )');

        foreach ($array as $row) {
            
            $row['DEXT_NARCOTIC'] = ($row['DEXT_NARCOTIC'] == 'Y') ? 1 : 0;
            $row['DEXT_ACTIVE'] = ($row['DEXT_ACTIVE'] == 'Y') ? 1 : 0;
            $row['DEXT_GHS'] = ($row['DEXT_GHS'] == 'Y') ? 1 : 0;

            $row['ACTIVEFLAG'] = ($row['ACTIVEFLAG'] == 'Y') ? 1 : 0;

            $stmt->bindParam(':PARTNAME', $row['PARTNAME']);
            $stmt->bindParam(':PARTDES', $row['PARTDES']);
            $stmt->bindParam(':SPEC19', $row['SPEC19']);
            $stmt->bindParam(':DEXT_NARCOTIC', $row['DEXT_NARCOTIC']);
            $stmt->bindParam(':DEXT_ACTIVE', $row['DEXT_ACTIVE']);
            $stmt->bindParam(':DEXT_NARCOTIC', $row['DEXT_NARCOTIC']);
            $stmt->bindParam(':SUPNAME', $row['SUPNAME']);
            $stmt->bindParam(':DEXT_IMPORTERNAME', $row['DEXT_IMPORTERNAME']);
            $stmt->bindParam(':DEXT_GHS', $row['DEXT_GHS']);
            $stmt->bindParam(':SPEC14', $row['SPEC14']);
            $stmt->bindParam(':DEXT_LIQUID', $row['DEXT_LIQUID']);
            $stmt->bindParam(':DEXT_FRAGILE', $row['DEXT_FRAGILE']);
            $stmt->bindParam(':DEXT_BRAND', $row['DEXT_BRAND']);
            $stmt->bindParam(':CUSTNAME', $row['CUSTNAME']);
            $stmt->bindParam(':SPEC1', $row['SPEC1']);
            $stmt->bindParam(':DEXT_CMVO', $row['DEXT_CMVO']);
            $stmt->bindParam(':DEXT_PARTBARCODE', $row['DEXT_PARTBARCODE']);
            $stmt->bindParam(':BARCODE', $row['BARCODE']);
            $stmt->bindParam(':DEXT_CSPOLICYCODE', $row['DEXT_CSPOLICYCODE']);
            $stmt->bindParam(':DEXT_SUPPOLICYCODE', $row['DEXT_SUPPOLICYCODE']);
            $stmt->bindParam(':UDATE', $row['UDATE']);
            $stmt->bindParam(':VATPRICE', $row['VATPRICE']);
            $stmt->bindParam(':WSPLPRICE', $row['WSPLPRICE']);

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