import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";

import jokeAbi from "../contract/joke.abi.json";

import { joke_contract } from "./functions";

let contract;
var kit;

// category to get jokes
let category = {index: -1, name: ""};

// add or remove a loader
const loader = (status) => status ? $('.loader').removeClass('d-none') : setTimeout(() => $('.loader').addClass('d-none'), 500);

window.addEventListener("load", async () => {
    console.log("⌛ Loading...");

    await connectCeloWallet();

    await getCategory(new URLSearchParams(window.location.search).get("c"));

    await loadJokes();
});

const connectCeloWallet = async () => {
    loader(true);
    
    if (window.celo) {
        console.log("⚠️ Please approve this DApp to use it.");
        try {
            await window.celo.enable();

            const web3 = new Web3(window.celo);
            kit = newKitFromWeb3(web3);

            const accounts = await kit.web3.eth.getAccounts();
            kit.defaultAccount = accounts[0];

            contract = new kit.web3.eth.Contract(jokeAbi, joke_contract);
        } catch (error) {
            console.log(`⚠️ ${error}.`);
        }
    } else {
        console.log("⚠️ Please install the CeloExtensionWallet.");
    }
    
    loader(false);
};

// get a category by it's title
const getCategory = async (c) => {
    const categories = await contract.methods.allCategories().call();

    categories.forEach((v, i) => {
        if (v === c)
            category = {index:i, name: v};
    });
}

// load all jokes
const loadJokes = async () => {
    loader(true);
    const jokes = await contract.methods.allJokes().call();

    $('#jokes_container').empty();

    var ratings = [];

    await $.get({
        url: `http://localhost:4000/getratings?address=${kit.defaultAccount}`,
        success: (data) => ratings = data.ratings
    });

    if(category.index !== -1) {
        $('.page_title').html(`Category - #${category.name}`)
    }

    for (let index in jokes) {

        // get jokes only with category we need
        if (parseInt(jokes[index].category_id) === parseInt(category.index)) {

            const category = await contract.methods.getCategory(jokes[index].category_id).call();

            var spec = [];

            await $.get({
                url: `http://localhost:4000/getratings?index=${index}`,
                success: (data) => spec = data
            });

            $('#jokes_container').append(`
            <div class="row">
                <div class="card col-md-6 mx-auto p-0 my-4">
                <div class="card-header"><a href="/profile.html?address=${jokes[index].user}">${jokes[index].user}</a> <small class="float-end">${new
                    Date(parseInt(jokes[index].create_timestamp)).toLocaleDateString()}</small></div>
                <div class="card-body">
                    <h5 class="card-title">${jokes[index].title}</h5>
                    <p class="card-text">${jokes[index].content}</p>
                    <div class="row actions">
                    <div class="col-md-6 text-center">
                        <button type="button" class="btn btn-mkn2 btn-sm like" data-index="${index}"><i
                            class="fas fa-thumbs-up"></i></button>
                        <span>${spec.likes}</span>
                    </div>
                    <div class="col-md-6 text-center">
                        <button type="button" class="btn btn-mkn3 btn-sm dislike" data-index="${index}"><i
                            class="fas fa-thumbs-down"></i></button>
                        <span>${spec.dislikes}</span>
                    </div>
                    </div>
                    <div class="row">
                    <span class="text-end">Category - <a href=""> #${category} </a></span>
                    </div>
                </div>
                </div>
            </div>
        `);

            if (ratings.likes.includes(parseInt(index)))
                $($(`button.like[data-index="${index}"`)[0]).addClass("selected");

            if (ratings.dislikes.includes(parseInt(index)))
                $($(`button.dislike[data-index="${index}"`)[0]).addClass("selected");
        }

        // joke like event
        $('.like').on('click', function () {
            loader(true);
            $.get({
                url: `http://localhost:4000/setrating?address=${kit.defaultAccount}&action=like&index=${$(this).attr("data-index")}`
            }).done(async () => {
                return await loadJokes();
            })
        });

        // joke dislike event
        $('.dislike').on('click', function () {
            loader(true);
            $.get({
                url: `http://localhost:4000/setrating?address=${kit.defaultAccount}&action=dislike&index=${$(this).attr("data-index")}`
            }).done(async () => {
                return await loadJokes();
            })

        });
        loader(false);
    }
}