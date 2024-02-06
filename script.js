document.addEventListener("DOMContentLoaded", function() {
    const accessKey = "sZWvEjHh-E9TtD0KOiZwCZ4aLCAv4WKACkdVEUhWQz8";

    const searchForm = document.getElementById("search-form");
    const searchBox = document.getElementById("search-box");
    const searchResult = document.getElementById("search-result");
    const imageContainer = document.getElementById("image-container");
    const wrapper = document.querySelector(".wrapper");

    // Function to fetch a random image from Unsplash
    async function fetchRandomImage() {
        const randomImageUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey}`;
        try {
            const imageResponse = await fetch(randomImageUrl);
            const imageData = await imageResponse.json();
            displayImage(imageData);
        } catch (error) {
            console.error('Error fetching random image:', error);
        }
    }

    // Function to display the fetched image
    function displayImage(imageData) {
        searchResult.src = imageData.urls.small;
        searchResult.alt = imageData.alt_description;
    }

    // Fetch a random image when the page loads
    fetchRandomImage();

    // Event listener for form submission
    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const searchWord = searchBox.value.trim();
        if (searchWord === "") {
            // If search box is empty, fetch a random image
            fetchRandomImage();
            return;
        }

        // Fetch image based on search word from Unsplash
        const searchImageUrl = `https://api.unsplash.com/photos/random?query=${searchWord}&client_id=${accessKey}`;
        try {
            const imageResponse = await fetch(searchImageUrl);
            const imageData = await imageResponse.json();
            displayImage(imageData);
        } catch (error) {
            console.error('Error fetching image based on search word:', error);
        }

        // Fetch word meaning only if search word is not empty
        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            displayMeaning(data, searchWord);
        } catch (error) {
            console.error('Error fetching meaning:', error);
        }
    });

    // Function to display the meaning of the word
    function displayMeaning(result, word) {
        if (result.title) {
            console.log(`Can't find the meaning of "${word}".`);
        } else {
            console.log(result);
            wrapper.classList.add("active");
            let definitions = result[0].meanings[0].definitions[0];
            let phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;

            document.querySelector(".word p").innerText = result[0].word;
            document.querySelector(".word span").innerText = phonetics;
            document.querySelector(".meaning span").innerText = definitions.definition;
        }
    }
});
