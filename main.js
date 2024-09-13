// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4WlwB5TI8Nar1cXOCGmiL7mSKwsN3F30",
  authDomain: "list-vocabulary.firebaseapp.com",
  projectId: "list-vocabulary",
  storageBucket: "list-vocabulary.appspot.com",
  messagingSenderId: "1087901987862",
  appId: "1:1087901987862:web:55660d3473cc60e2157137"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const wordInput = document.getElementById('word');
const submitBtn = document.getElementById('submit');
const vocabList = document.getElementById('vocab-list');

submitBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const newWord = wordInput.value.trim();

    if (newWord) {
    // Chuyển đổi tất cả chữ thành chữ thường và viết hoa chữ cái đầu
    const formattedWord = newWord.toLowerCase().charAt(0).toUpperCase() + newWord.slice(1);

    // Kiểm tra xem từ đã tồn tại chưa
    const q = query(collection(db, "vocabulary"), where("word", "==", formattedWord));
    getDocs(q)
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          alert("This word already exists.");
        } else {
          // Nếu từ chưa tồn tại, thì mới thêm vào Firestore
          addDoc(collection(db, "vocabulary"), {
            word: formattedWord
          })
          .then((docRef) => {
            alert("Succeed in add word", docRef);
            wordInput.value = "";
            displayWord(formattedWord);
          })
          .catch((error) => {
            alert("Error adding document:", error);
          });
        }
      })
      .catch((error) => {
        alert("Error getting documents:", error);
      });
  } else {
    alert("Please enter a word!");
  }
});

function displayWord(word) {
  const listItem = document.createElement('li');
  listItem.textContent = word;
  vocabList.appendChild(listItem);
}

// get data from Firestore
async function getVocabularyData() {
  try {
    const vocabularyRef = collection(db, "vocabulary");
    const querySnapshot = await getDocs(vocabularyRef);

    let data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    return data;
  } catch (error) {
    console.error("Error getting vocabulary:", error);
    return []; // Return an empty array in case of errors
  }
}

function extractVocabulary(vocabularyData) {
  let data = [];

  vocabularyData.forEach(item => {
    data.push([item.title || "", item.word]); // Use "title" if available, otherwise empty string
  });

  return data;
}

function convertToCSV(data) {
  let csvContent = "data:text/csv;charset=utf-8,";

  data.forEach(row => {
      csvContent += row.join("") + "\r\n";
  });

  return csvContent;
}

function downloadCSV(filename, csvContent) {
  let encodedUri = encodeURI(csvContent);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


let vocabulariesData = extractVocabulary(await getVocabularyData());
let csvContent = convertToCSV(vocabulariesData);

const btn = document.querySelector('#download');
btn.addEventListener('click', () => {
    confirm('Are you sure you want to download the data?') && downloadCSV('voters.csv', csvContent);
});