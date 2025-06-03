//menampilkan di layar
window.onload = function () {
  // konfigurasi firebase
  var firebaseConfig = {
    apiKey: "AIzaSyDqiHMN82XqatCBw4iKRcK71Z-vqiJRbdg",
    authDomain: "globalchat-6ae1d.firebaseapp.com",
    databaseURL:
      "https://globalchat-6ae1d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "globalchat-6ae1d",
    storageBucket: "globalchat-6ae1d.appspot.com",
    messagingSenderId: "495782483996",
    appId: "1:495782483996:web:0eefc524e8e7217506e7d9",
  };
  // inisialisasi firebase
  firebase.initializeApp(firebaseConfig);
  //membuat pernyataan database
  var db = firebase.database();

  //pakai OOP
  class winchat {
    // home() dipakai untuk homepage
    home() {
      document.body.innerHTML = "";
      this.create_title();
      this.create_join_form();
    }
    // chat() dipakai untuk membuat halaman chat
    chat() {
      this.create_title();
      this.create_chat();
    }
    // create_title() untuk membuat title
    create_title() {
      // This is the title creator.
      var title_container = document.createElement("div");
      title_container.setAttribute("id", "title_container");
      var title_inner_container = document.createElement("div");
      title_inner_container.setAttribute("id", "title_inner_container");

      var title = document.createElement("h1");
      title.setAttribute("id", "title");
      title.textContent = "WinChat";
      title_inner_container.append(title);
      title_container.append(title_inner_container);
      document.body.append(title_container);
    }
    // create_join_form() membuat join form
    create_join_form() {
      var parent = this;

      var join_container = document.createElement("div");
      join_container.setAttribute("id", "join_container");
      var join_inner_container = document.createElement("div");
      join_inner_container.setAttribute("id", "join_inner_container");

      var join_button_container = document.createElement("div");
      join_button_container.setAttribute("id", "join_button_container");

      var join_button = document.createElement("button");
      join_button.setAttribute("id", "join_button");
      join_button.innerHTML = "Masuk bray";

      var join_input_container = document.createElement("div");
      join_input_container.setAttribute("id", "join_input_container");

      var join_input = document.createElement("input");
      join_input.setAttribute("id", "join_input");
      join_input.setAttribute("maxlength", 25);
      join_input.placeholder = "Masukkan nama anonim-mu";

      //permisalan
      join_input.onkeyup = function () {
        if (join_input.value.length > 0) {
          // kalo ada, button bisa coi
          join_button.classList.add("enabled");
          join_button.onclick = function () {
            // Save nama yang diinput
            parent.save_name(join_input.value);
            // hapus join_container, biar ga jelek
            join_container.remove();
            parent.create_chat();
          };
        } else {
          // kalo kosong, button ga bisa coi
          join_button.classList.remove("enabled");
        }
      };

      //append semuanya
      join_button_container.append(join_button);
      join_input_container.append(join_input);
      join_inner_container.append(join_input_container, join_button_container);
      join_container.append(join_inner_container);
      document.body.append(join_container);
    }
    // bikin loading chat bulet-bulet
    create_load(container_id) {
      var parent = this;
      var container = document.getElementById(container_id);
      container.innerHTML = "";

      var loader_container = document.createElement("div");
      loader_container.setAttribute("class", "loader_container");

      var loader = document.createElement("div");
      loader.setAttribute("class", "loader");

      loader_container.append(loader);
      container.append(loader_container);
    }
    // membuat chat container
    create_chat() {
      var parent = this;
      //membuat header winchat
      var title_container = document.getElementById("title_container");
      var title = document.getElementById("title");
      title_container.classList.add("chat_title_container");

      title.classList.add("chat_title");

      var chat_container = document.createElement("div");
      chat_container.setAttribute("id", "chat_container");

      var chat_inner_container = document.createElement("div");
      chat_inner_container.setAttribute("id", "chat_inner_container");

      var chat_content_container = document.createElement("div");
      chat_content_container.setAttribute("id", "chat_content_container");

      var chat_input_container = document.createElement("div");
      chat_input_container.setAttribute("id", "chat_input_container");

      var chat_input_send = document.createElement("button");
      chat_input_send.setAttribute("id", "chat_input_send");
      chat_input_send.setAttribute("disabled", true);
      chat_input_send.innerHTML = `<i class="far fa-paper-plane"></i>`;

      var chat_input = document.createElement("input");
      chat_input.setAttribute("id", "chat_input");
      // atur batas max chat yang diketik
      chat_input.setAttribute("maxlength", 1000);
      // get nama user yang sedang chat
      chat_input.placeholder = `${parent.get_name()}, Katakan sesuatu...`;
      chat_input.onkeyup = function () {
        if (chat_input.value.length > 0) {
          chat_input_send.removeAttribute("disabled");
          chat_input_send.classList.add("enabled");
          chat_input_send.onclick = function () {
            chat_input_send.setAttribute("disabled", true);
            chat_input_send.classList.remove("enabled");
            if (chat_input.value.length <= 0) {
              return;
            }
            // aktifin loading circle
            parent.create_load("chat_content_container");
            // buat ngirim pesan
            parent.send_message(chat_input.value);
            // hapus pesan yang diinput
            chat_input.value = "";
            // aktifin send button
            chat_input.focus();
          };
        } else {
          chat_input_send.classList.remove("enabled");
        }
      };

      // Mendeteksi perubahan ukuran layar (misalnya, saat keyboard muncul atau menghilang)
      //ini buat mobile coi
      window.addEventListener("resize", function () {
        // Menghitung tinggi keyboard
        var keyboardHeight = window.innerHeight - window.visualViewport.height;

        // Ubah tinggi chat input bar
        var chatInput = document.getElementById("chat_input");
        chatInput.style.height = "calc(100% - " + keyboardHeight + "px)";
      });

      var chat_logout_container = document.createElement("div");
      chat_logout_container.setAttribute("id", "chat_logout_container");

      var chat_logout = document.createElement("button");
      chat_logout.setAttribute("id", "chat_logout");
      chat_logout.textContent = `logout`;

      // hapus nama user kalo logout
      chat_logout.onclick = function () {
        localStorage.clear();
        // balikin ke halaman home atau input name
        parent.home();
      };

      chat_logout_container.append(chat_logout);
      chat_input_container.append(chat_input, chat_input_send);
      chat_inner_container.append(
        chat_content_container,
        chat_input_container,
        chat_logout_container
      );
      chat_container.append(chat_inner_container);
      document.body.append(chat_container);
      // aktifin loading circle
      parent.create_load("chat_content_container");
      // refresh chat dan dapetin data chat dari firebase
      parent.refresh_chat();
    }
    // nyimpen nama ke local storage
    save_name(name) {
      localStorage.setItem("name", name);
    }

    // buat ngirim pesan coi
    async send_message(message) {
      var parent = this;

      try {
        // Membaca file badWords.txt dari file txt
        const response = await fetch("badWords.txt");
        if (!response.ok) {
          throw new Error("File tidak ditemukan");
        }
        const data = await response.text(); // Mengambil data sebagai teks

        // Memecah data berdasarkan baris untuk mendapatkan array dari kata-kata kasar
        const badWords = data.split("\n").map((word) => word.trim());

        // Membuat pola untuk mendeteksi substitusi huruf vokal dengan angka/simbol
        function createRegexPattern(word) {
          if (!word || word.length === 0) return "";
          return word
            .split("")
            .map((char) => {
              switch (char.toLowerCase()) {
                case "a":
                  return "[a4@#]";
                case "e":
                  return "[e3]";
                case "i":
                  return "[i1!]";
                case "o":
                  return "[o0]";
                case "u":
                  return "[uv]";
                default:
                  return char;
              }
            })
            .join("");
        }

        // Membuat pola regex yang mempertimbangkan substitusi untuk setiap kata kasar
        const badWordsPatterns = badWords.map((word) =>
          createRegexPattern(word)
        );

        // Algoritma Regular Expression yang ditingkatkan
        const badWordsRegex = new RegExp(
          `(${badWordsPatterns.join("|")})`,
          "gi"
        );
        // g = Menyuruh RegEx untuk mencari semua kecocokan dalam teks, bukan hanya kecocokan pertama.
        // i = Menyuruh RegEx untuk memeriksa semua huruf kecil dan besar.

        if (badWordsRegex.test(message)) {
          // Men-sensor kata kasar sesuai jumlah huruf
          message = message.replace(badWordsRegex, function (match) {
            return "*".repeat(match.length); // Buat tanda bintang sebanyak panjang kata
          });
        }

        // Memeriksa jika nama atau pesan kosong
        if (parent.get_name() == null || message == null) {
          return;
        }

        // Function untuk mendapatkan waktu saat ini
        function getCurrentTime() {
          const now = new Date();
          const year = now.getFullYear();
          const month = (now.getMonth() + 1).toString().padStart(2, "0");
          const date = now.getDate().toString().padStart(2, "0");
          const hours = now.getHours().toString().padStart(2, "0");
          const minutes = now.getMinutes().toString().padStart(2, "0");
          return `${date}/${month}/${year} ${hours}:${minutes}`;
        }

        // Mendapatkan nilai dari firebase database
        const message_object = await db.ref("chats/").once("value");
        var index = parseFloat(message_object.numChildren()) + 1;

        await db.ref("chats/" + `message_${index}`).set({
          name: parent.get_name(),
          message: message,
          time: getCurrentTime(),
          index: index,
        });

        // Setelah mengirim pesan, refresh chat
        parent.refresh_chat();
      } catch (err) {
        // Menangani error jika terjadi kesalahan
        alert("Terjadi kesalahan: " + err.message);
      }
    }

    // dapetin nama dari local
    get_name() {
      if (localStorage.getItem("name") != null) {
        return localStorage.getItem("name");
      } else {
        this.home();
        return null;
      }
    }
    // refresh chat buat dapetin update chat
    refresh_chat() {
      var chat_content_container = document.getElementById(
        "chat_content_container"
      );

      // dapetin dari firebase
      db.ref("chats/").on("value", function (messages_object) {
        // kalo dh dapet data, clear chat content container
        chat_content_container.innerHTML = "";
        // kalo dh tidak ada data, ya gausah load
        if (messages_object.numChildren() == 0) {
          return;
        }

        // ubah massage object ke array
        var messages = Object.values(messages_object.val());
        var guide = []; // this will be our guide to organizing the messages
        var unordered = [];
        var ordered = [];

        for (var i, i = 0; i < messages.length; i++) {
          guide.push(i + 1);
          unordered.push([messages[i], messages[i].index]);
        }

        guide.forEach(function (key) {
          var found = false;
          unordered = unordered.filter(function (item) {
            if (!found && item[1] == key) {
              ordered.push(item[0]);
              found = true;
              return false;
            } else {
              return true;
            }
          });
        });

        // nampilin urutan chat
        ordered.forEach(function (data) {
          var name = data.name;
          var message = data.message;
          var time = data.time; // keterangan waktu

          var message_container = document.createElement("div");
          message_container.setAttribute("class", "message_container");

          var message_inner_container = document.createElement("div");
          message_inner_container.setAttribute(
            "class",
            "message_inner_container"
          );

          var message_user_container = document.createElement("div");
          message_user_container.setAttribute(
            "class",
            "message_user_container"
          );

          var message_user = document.createElement("p");
          message_user.setAttribute("class", "message_user");
          message_user.textContent = `${name} at ${time}`; // tampilin nama dan waktu

          var message_content_container = document.createElement("div");
          message_content_container.setAttribute(
            "class",
            "message_content_container"
          );

          var message_content = document.createElement("p");
          message_content.setAttribute("class", "message_content");
          message_content.textContent = `${message}`;

          message_user_container.append(message_user);
          message_content_container.append(message_content);
          message_inner_container.append(
            message_user_container,
            message_content_container
          );
          message_container.append(message_inner_container);

          chat_content_container.append(message_container);
        });
        // chat baru msk ke bawah
        chat_content_container.scrollTop = chat_content_container.scrollHeight;
      });
    }
  }

  var app = new winchat();
  if (app.get_name() != null) {
    app.chat();
  }
};
// Mendeteksi perubahan ukuran layar saat keyboard muncul atau hilang
window.addEventListener("resize", function () {
  var chatInputContainer = document.getElementById("chat_input_container");
  // Jika tinggi viewport lebih kecil dari tinggi layar, maka keyboard kemungkinan muncul
  if (window.innerHeight < screen.height) {
    chatInputContainer.style.bottom = "10px"; // Sesuaikan nilai ini agar berada di atas keyboard
  } else {
    chatInputContainer.style.bottom = "0"; // Kembalikan ke posisi bawah jika keyboard hilang
  }
});
