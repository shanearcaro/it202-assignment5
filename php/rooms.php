<table id='rooms'><tr>
<?php
    include "../php/database.php";

    $connection = mysqli_connect($server, $username, $password, $database);

    // Check for connection error
    if (mysqli_connect_error()) 
        echo "Failed to connect to MYSQL: " . mysql_connect_error();

    // ini_set('display_errors', 1); 
    // error_reporting('​E_ALL');

    $query = "SELECT * FROM Rooms INNER JOIN Users ON Rooms.UserA=Users.UserID ORDER BY ID";
    $results = mysqli_query($connection, $query);
    while($row = mysqli_fetch_array($results)) :
        $size += 1;
?>
		<td class='top-row'><?php echo $row['Username']; ?></td>
<?php 
    endwhile;
?>
<td class='top-row'>Create Room</td></tr>

<?php
    // Bottom row must match top even when users are no longer being found.
    // Instead a button is placed with the room id allowing users to join
    $query = "SELECT ID FROM Rooms ORDER BY ID";
    $roomIds = mysqli_query($connection, $query);

    $query = "SELECT * FROM Rooms INNER JOIN Users ON Rooms.UserB=Users.UserID ORDER BY ID";
    $results = mysqli_query($connection, $query);
    $count = 0;
    while($count < $size) :
        $count += 1;
        $row = mysqli_fetch_array($results);
        $room = mysqli_fetch_array($roomIds);
?>
        <td class='bottom-row'>
        <?php 
            if (isset($row['Username'])) 
                echo $row['Username'];
            else
                echo "<button type='button'" . "class='join' id=" . $room['ID'] . " onClick=joinRoom(this.id)>Join</button></td>";
        ?>
        </td>
<?php 
    endwhile;
?>
<td class='bottom-row'>
    <?php
    echo "<button type='button'" . "class='join' id=" . -1 . " onClick=joinRoom(this.id)>Join</button></td>";
    mysqli_close($connection);
    ?>
</td></tr></table>