// Boolean flag to determine whether user is logged in or not
let userLoggedIn = false;

// Record username once logged in
let userID = -1;

// Record room number of user
let joinedRoom = -1;

/**
 * User messages will determine how many messages have been found.
 * Because users cannot delete messages, when messages are deleted
 * when the other chatter leaves the room the current user can be 
 * notified.
 */
let userMessages = 0;

/**
 * Attempting to make scrollable interface
 */
let scrollPosition = 0;

/**
 * Create an AJAX get call to rooms.php file which will dynamically
 * print out created rooms. Room buttons will be constantly enabled
 * or disabled depending on if the user is logged in or not. This will
 * prevent a user from joining a room before logging in.
 */
function displayRooms() {
    let ajax = new XMLHttpRequest();

    // Set chat-text to HTML set in rooms.php
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            document.getElementById('room-area').innerHTML = ajax.responseText;

            if (!userLoggedIn)
                disableButtons();
        }
    }

    // Open and send request
    ajax.open("GET", "../php/rooms.php", true);
    ajax.send();
}

/**
 * Create an AJAX post call to login.php file which will check
 * user information against the database. If user info matches
 * an account within the database the user will be allowed to
 * join existing rooms or create their own.
 */
function login() {
    let username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;

    // Validate username and info sent in by user
    // Display error message if bad info
    if (!validateInfo(username, password)) {
        alert("Error: Invalid Login Credentials.")
        return;
    }

    // Start AJAX call to send user info to PHP script
    let credentials = "username=" + username + "&password=" + password;
    let ajax = new XMLHttpRequest();

    // Check Ajax call for proper response
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            if (ajax.responseText.indexOf("Error:") != -1)
                alert(ajax.responseText);
            else {
                userLoggedIn = true;
                enableButtons();
                deleteLogin();
                userID = Number(ajax.responseText);
            }
        }
    };

    // Open and send request
    ajax.open("POST", "../php/login.php", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send(credentials);
}

/**
 * Create an AJAX post call to join.php file which will insert
 * user into a room or create a new room with the user as the 
 * owner.
 * @param {Integer} roomID Joined room ID
 */
function joinRoom(roomID) {
    let ajax = new XMLHttpRequest();
    let credentials = "userID=" + userID + "&roomID=" + roomID;

    // Check Ajax call for proper response
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            if (ajax.responseText != "")
                roomID = Number(ajax.responseText);
            joinedRoom = roomID;
            userLoggedIn = false;
            // After a room is joined create the message area
            let chatDiv = document.getElementById('message-area');
            let chatMessage = document.createElement('input');
            let chatButton = document.createElement('button');

            // Allow users to use enter button to submit chats
            chatMessage.addEventListener("keyup", function(e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    chatButton.click();
                }
            });

            chatMessage.id = 'chat-message';
            chatButton.id = 'chat-button';
            chatMessage.placeholder = "Send a message...";
            chatButton.onclick = function() {sendMessage()};
            chatButton.innerText = "Send Message";

            // Restrict length of chat messages
            chatMessage.maxLength = 100;
            chatMessage.minLength = 1;

            chatDiv.appendChild(chatMessage);
            chatDiv.appendChild(chatButton);
        }
    };

    // Open and send request
    ajax.open("POST", "../php/join.php", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send(credentials);
}

/**
 * Create an AJAX post call to createMessage.php file which will insert
 * a new message into Messages with the user's id. These messages will 
 * be dynamically displayed to all users in the same room.
 */
function sendMessage() {
    let message = document.getElementById('chat-message').value;

    let credentials = "message=" + message + "&userID=" + userID;
    let ajax = new XMLHttpRequest();

    // Check Ajax call for proper response
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            document.getElementById('chat-message').value = "";
        }
    };

    // Open and send request
    ajax.open("POST", "../php/createMessage.php", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send(credentials);
}

/**
 * Create an AJAX post call to message.php file which will display
 * all messages within a room to the users. To detect if a user has
 * left the room, compare the current number of messages to the 
 * previous amount. If the previous amount is higher the other user
 * has left. Notify the current user of this and refresh the page.
 */
function displayMessages() {
    let credentials = "roomID=" + joinedRoom + "&userID=" + userID;
    let ajax = new XMLHttpRequest();

    // Check Ajax call for proper response
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            document.getElementById('chat-area').innerHTML = ajax.responseText;

            let userMessageCount = userMessages;
            userMessages = document.getElementsByClassName('user-messages').length;
            
            let scrollElement = document.getElementById("chats-body");
            // let scrollBody = document.getElementById("chats-body");

            if (scrollElement !== null) {
                scrollElement.scrollTop = scrollElement.scrollHeight;
            }

            // Other user has logged out
            if (userMessages < userMessageCount) {
                alert("User has left chat room.");
                window.removeEventListener('beforeunload', onClose);
                location.reload();
            }
            // Change background color of text in alternating format
            let sentMessages = document.getElementsByClassName("user-messages");
            if (sentMessages[0] != undefined) {
                sentMessages[0].classList.add("light");
                for (let i = 1; i < sentMessages.length; i++) {
                    let previousMessage = sentMessages[i - 1];
                    let currentMessage = sentMessages[i];
                    let previousClassList = previousMessage.classList;
                    let currentClassList = currentMessage.classList;

                    if (previousClassList.contains("light"))
                        currentClassList.add("dark")
                    else
                        currentClassList.add("light");
                }
            }
        }
    };

    // Open and send request
    ajax.open("POST", "../php/message.php", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send(credentials);
}

/**
 * Create an AJAX post call to destroy.php file which will delete
 * all user messages within a certain room. The room itself will
 * also be deleted.
 */
function deleteLogs() {
    let credentials = "roomID=" + joinedRoom;
    let ajax = new XMLHttpRequest();

    // Check Ajax call for proper response
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
        }
    };

    // Open and send request
    ajax.open("POST", "../php/destroy.php", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send(credentials);
}

/**
 * Validate user information for a username by checking the length
 * to be greater than 2. Password is valid if it contains a uppercase letter,
 * a number, and length is greater than 7
 * @param {string} username User's username 
 * @param {string} password User's password
 */
function validateInfo(username, password) {
    // Validate username
    function validateUsername(username) {
        return username.length >= 3;
    }

    // Validate password
    function validatePassword(password) {
        let uppercase = false;
        let number = false;

        // Check password for at least once uppercase letter
        // and at least one number
        for (let letter = 0; letter < password.length; letter++) {
            let charCode = password.charCodeAt(letter);
            if (charCode >= 65 && charCode <= 90)
                uppercase = true;
            if (charCode >= 48 && charCode <= 57)
                number = true;
        }
        return password.length >= 8 && uppercase && number;
    }
    return validateUsername(username) && validatePassword(password);
}

/**
 * On load function that starts default criteria and communication
 * between server and client
 */
function setUpdates() {
    // Clear username when page is reloaded
    document.getElementById('login-username').value = "";

    // Start updating rooms from database
    setInterval(function() {displayRooms()}, 1000);
    // Start updating messages from database
    setInterval(function() {displayMessages()}, 1000);

    // Add ability to press enter to submit user information
    document.getElementById('login-password').addEventListener("keyup", function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            document.getElementById('loginButton').click();
        }
    });
}

/**
 * Uses removeChildren helper method to delete login form
 */
function deleteLogin() {
    let form = document.getElementById("login-header");
    removeChildren(form);
}

/**
 * Deletes all children from a parent element
 * @param {elementID string} parent Node Parent element
 */
function removeChildren(parent) {
    while (parent.firstChild)
        parent.removeChild(parent.firstChild);
}

/**
 * Disable all join buttons if a user is not logged in. Buttons will be visible
 * but css will alter the color.
 */
function disableButtons() {
    let buttons = document.getElementsByClassName("join");

    for (let i = 0; i < buttons.length; i++)
        buttons[i].disabled = true;
}

/**
 * Enable all join buttons once a user is logged in. 
 */
function enableButtons() {
    let buttons = document.getElementsByClassName("join");

    for (let i = 0; i < buttons.length; i++)
        buttons[i].disabled = false;
}

// Adding window event listen before page close
window.addEventListener("beforeunload", onClose);

/**
 * Prevent the page from closing immediately and if the user is in a room
 * delete all messages and the room itself. The second user will also be
 * logged out.
 * @param {event} e event 
 */
function onClose(e) {
    e.preventDefault();
    let username = document.getElementById('login-username');

    if (username !== null)
        username.value = "";

    if (joinedRoom != -1)
        deleteLogs();
}
