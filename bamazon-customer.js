let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "RoseWhale53",
    database: "bamazon"
});

// function createSong() {
//     inquirer.prompt([
//         {
//             name: "songTitle",
//             message: "Please enter the song title"
//         },
//         {
//             name: "songArtist",
//             message: "Please enter the artist's name"
//         },
//         {
//             name: "songGenre",
//             message: "Please enter the song's genre"
//         }
//     ]).then(function(answers) {
//         console.log("Adding a new song...\n");
//     var query = connection.query(
//         "INSERT INTO music SET ?",
//         {
//             title: answers.songTitle,
//             artist: answers.songArtist,
//             genre: answers.songGenre
//         },
//         function (err, res) {
//             console.log(res.affectedRows + " song(s) added!\n");
//             queryAllSongs();
            
//         }
//     );
//     });
    
// }

// function updateSong() {
//     inquirer.prompt([
//         {
//             name: "songId",
//             message: "Please enter the ID of the song you'd like to update"
//         },
//         {
//             name: "songTitle",
//             message: "Please enter the song title"
//         },
//         {
//             name: "songArtist",
//             message: "Please enter the artist's name"
//         },
//         {
//             name: "songGenre",
//             message: "Please enter the song's genre"
//         }
//     ]).then(function(newInput) {
//         var query = connection.query(
//             "UPDATE music SET ? WHERE ?",
//             [
//                 {
//                     title: newInput.songTitle,
//                     artist: newInput.songArtist,
//                     genre: newInput.songGenre
//                 },
//                 {
//                     id: newInput.songId
//                 }
//             ],
//             function (err, res) {
//                 console.log(res.affectedRows + " song(s) updated!\n");
//                 queryAllSongs();
//             }
//         );  
//     });
// }

function displayAllItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("\n" + "-".repeat(100) + "\n" + res[i].product_name + "\n\nUnique item ID#: " + res[i].item_id + "\n\nDepartment: " + res[i].department_name + "\n\nPrice: " + "$" + res[i].price + "\n\nQuantity on hand: " + res[i].stock_quantity + "\n" + "-".repeat(100));
        }
        connection.end();
    });
}

// function querySongsByGenre() {
//     inquirer.prompt([
//         {
//             name: "genre",
//             message: "Please enter a genre"
//         }
//     ]).then(function(genreInput) {
//         var query = connection.query("SELECT * FROM music WHERE genre=?", genreInput.genre, function (err, res) {
//             for (var i = 0; i < res.length; i++) {
//                 console.log(res[i].id + " | " + res[i].title + " | " + res[i].artist + " | " + res[i].genre);
//             }
//             console.log("-".repeat(50));
//             connection.end();
//         }); 
//     });
// }

// function deleteSong() {
//     inquirer.prompt([
//         {
//             name: "songTitle",
//             message: "Please enter the name of the song you'd like to delete"
//         }
//     ]).then(function(titleInput) {
//         connection.query(
//             "DELETE FROM music WHERE ?",
//             {
//                 title: titleInput.songTitle
//             },
//             function (err, res) {
//                 console.log(res.affectedRows + " song(s) deleted!\n");
//                 // Call readProducts AFTER the DELETE completes
//                 queryAllSongs();
//             });
//     });
// }

// connection.connect(function (err) {
//     if (err) throw err;
//     //   console.log("connected as id " + connection.threadId);
//     inquirer.prompt([
//         {
//             type: "rawlist",
//             name: "functions",
//             message: "What would you like to do?",
//             choices: [
//                 "Add a song",
//                 "Update a song listing",
//                 "Delete a song",
//                 "Print all songs",
//                 "Print songs by genre"
//             ]
//         }
//     ]).then(function(userChoice) {
//         switch (userChoice.functions) {
//             case "Add a song":
//                 createSong();
//                 break;
//             case "Update a song listing":
//                 updateSong();
//                 break;
//             case "Delete a song":
//                 deleteSong();
//                 break;
//             case "Print all songs":
//                 queryAllSongs();
//                 break;
//             case "Print songs by genre":
//                 querySongsByGenre();
//                 break;
//         }

//     });
// });

connection.connect(function (err) {
    if (err) throw err;
      console.log("connected as id " + connection.threadId);
      
    displayAllItems();
});

