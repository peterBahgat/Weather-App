// Global variables for dom manipulation
const generate = document.getElementById('generate');
const zip = document.getElementById('zip');
const temp = document.getElementById('temp');
const feelingsInput = document.getElementById('feelings');
const feelingsOutput = document.querySelector('.feelings');
const dateOutput = document.getElementById('date');
const message = document.getElementById('error');
const city = document.getElementById('city');
const country = document.getElementById('country');
const description = document.getElementById('description');



/* URL that will be fetched*/
//const urlExample = "https://api.openweathermap.org/data/2.5/weather?zip={zip code}&appid={API key}";
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "&appid=71e152d8509bc3f3add477d1ba26eae5&units=imperial";


// click event function which fires chaining promises
const performAction = () => {
    generate.addEventListener("click",async (event) => {
        event.preventDefault;
        const createURL = `${baseURL}${zip.value}${apiKey}`;
        const apiData = await getAPIData(createURL)
        const filteredData = filterAPIData(apiData)
        await postDataToServer("/addData", filteredData) 
        const  data = await getDataFromServer("/all")
        updateUI(data); 
    });
}
// invoke the the eventlistener async function
performAction();


// async function to get API data through fetching a url parameter
const getAPIData = async (url) => {
    try {
        const apiResponse = await fetch(url);
        const data = await apiResponse.json();
        return data
    } catch (error) {
        console.error(error);
    }
}


// async function to refine the needed data and create an object which will be sended to the endPoint
const filterAPIData = (data) => {
        if(data.cod === 200){
            const neededData = {
                date: new Date().toDateString(),
                feelings: feelingsInput.value,
                temp: data.main.temp,
                reqStatus: data.cod,
                city: data.name,
                country: data.sys.country,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                message: data.message
            };
            console.log(neededData)
            return neededData;
        }else{
            return data
        }
}


// async function that post the data to the local server
const postDataToServer = async (url = "", data = {}) => {
    try {
        const postedData = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return postedData;
    } catch (error) {
        console.error(error);
    }
}


// async function that retreiving the data from the local server which will be used to update the UI
const getDataFromServer = async (url) => {
    const retreivedData = await fetch(url);
    try {
        const response = await retreivedData.json();
        return response;
    } catch (error) {
        console.error(error);
    }
}


// async function that updates UI
const updateUI =  (data) => {
    if (data.reqStatus === 200) {
        document.querySelector('#result').style.display = "grid";
        dateOutput.innerHTML = `Today is ${data.date}`;
        temp.innerHTML = `Tempreture is ${data.temp} °C`;
        description.innerHTML = `The weather is ${data.description}`;
        city.innerHTML = `in ${data.city},`;
        country.innerHTML = `${data.country}`;
        feelingsOutput.innerHTML = data.feelings !== ""?`and you said '${data.feelings}'`:`What is your feelings 😄?`;
        document.querySelector('#message').style.display = "none";
    } else {
        document.querySelector('#message').style.display = "grid";
        message.innerHTML = data.message;
        document.querySelector('#result').style.display = "none";
    }
    
}