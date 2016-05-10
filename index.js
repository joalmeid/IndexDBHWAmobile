function RunDexie () {
    var db = new Dexie("FriendDatabase");

    db.version(1).stores({
        friends: "++id,name,age"
    });

    db.open().catch (function (e) {
        alert ("Oh oh: " + e);
    });

    db.friends.add({name: "Josephine", age: 21}).then(function(){
        db.friends.where("age").between(20, 30).each(function(friend) {
            myAlert ("Found young friend: " + JSON.stringify(friend));
        });
    });
}

function myAlert(message) {
    if(typeof Windows !== 'undefined'  && 
    typeof Windows.UI !== 'undefined'  && 
    typeof Windows.UI.Popups !== 'undefined' ) {
        // Create the message dialog and set its content
        var msg = new Windows.UI.Popups.MessageDialog(message);
/*        // Add commands
        msg.commands.append(new Windows.UI.Popups.UICommand("Okay", systemAlertCommandInvokedHandler));
        // Set default command
        msg.defaultCommandIndex = 0;
*/        // Show the message dialog
        msg.showAsync();
    }
    else{
        alert(message);
    }
}

function btnAlert(){
    myAlert ("TEST TEST TEST ");
}

