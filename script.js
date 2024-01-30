// Ensure the DOM is loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
    const wrapper = document.querySelector(".wrapper"),
        searchInput = wrapper.querySelector("input"),
        synonyms = wrapper.querySelector(".synonyms .list"),
        infoText = wrapper.querySelector(".info-text"),
        volumeIcon = wrapper.querySelector(".word i"),
        removeIcon = wrapper.querySelector(".search span");
    let audio;

    //data function
    function data(result, word) {
        if (result.title) {
            infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try searching for another word.`;
        } else {
            console.log(result);
            wrapper.classList.add("active");
            let definitions = result[0].meanings[0].definitions[0];
            let phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;

            // Update audio URL based on the word
            audio = new Audio(`https://api.dictionaryapi.dev/media/pronunciations/en/${word}.mp3`);

            // Update other parts of the UI based on the API response
            document.querySelector(".word p").innerText = result[0].word;
            document.querySelector(".word span").innerText = phonetics;
            document.querySelector(".meaning span").innerText = definitions.definition;
            document.querySelector(".example span").innerText = definitions.example;

            if (definitions.synonyms && definitions.synonyms.length > 0) {
                synonyms.parentElement.style.display = "block";
                synonyms.innerHTML = "";
                for (let i = 0; i < Math.min(definitions.synonyms.length, 5); i++) {
                    let tag = `<span onClick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
                    synonyms.insertAdjacentHTML("beforeend", tag);
                }
            } else {
                synonyms.parentElement.style.display = "none";
            }
        }
    }

    function search(word) {
        searchInput.value = word;
        fetchApi(word);
        wrapper.classList.remove("active");
    }

    function fetchApi(word) {
        wrapper.classList.remove("active");
        infoText.style.color = "#000";
        infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
        let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        fetch(url)
            .then(res => res.json())
            .then(result => data(result, word))
            .catch(error => {
                console.error('Error fetching API:', error);
                infoText.innerHTML = `An error occurred while fetching the meaning of <span>"${word}"</span>. Please try again later.`;
            });
    }

    searchInput.addEventListener("keyup", e => {
        if (e.key === "Enter" && e.target.value) {
            fetchApi(e.target.value);
        }
    });

    volumeIcon.addEventListener("click", () => {
        if (audio) {
            audio.play();
        }
    });

    removeIcon.addEventListener("click", () => {
        searchInput.value = "";
        searchInput.focus();
        wrapper.classList.remove("active");
    });
});
