<?php
    include '../php/database.php';

    // Connect to SQL database
    $connection = mysqli_connect($server, $username, $password, $database);

    // Check for connection error
    if (mysqli_connect_error()) {
        echo "Failed to connect to MYSQL: " . mysql_connect_error();
        die();
    }

    // Get username and password from Ajax
    $cred_username = $_POST["username"];
    $cred_password = $_POST["password"];

    // Check to see if username and password exists in the database
    $query = "SELECT UserID FROM Users WHERE Username='{$cred_username}' AND Password='{$cred_password}'";
    $results = mysqli_query($connection, $query);
    $row = mysqli_fetch_array($results);
    $size = count($row);

    $userID = $row['UserID'];

    // Size will be a positive non zero number if user exists
    if ($size == 0)
        echo "Error: Invalid Login Credentials.";
    echo $userID;
    mysqli_close($connection);
?>