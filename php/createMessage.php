<?php
    include "../php/database.php";

    $connection = mysqli_connect($server, $username, $password, $database);

    // Check for connection error
    if (mysqli_connect_error()) 
        echo "Failed to connect to MYSQL: " . mysql_connect_error();

    // Get the message from Ajax call
    $message = $_POST['message'];
    // String has to be altered so it can be inserted properly
    $newMessage = str_replace("'", "''", "$message");
    $userID = $_POST['userID'];

    // Insert message with id into database
    $query = "INSERT INTO Messages (Message, UserID) VALUES ('{$newMessage}', '{$userID}')";
    echo mysqli_query($connection, $query);
    mysqli_close($connection);
?>