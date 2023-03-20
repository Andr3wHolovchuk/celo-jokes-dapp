"use strict";

import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";

import jokeAbi from "../contract/joke.abi.json";
import { joke_contract } from "./functions";

let contract;
var kit;

// add or remove a loader
const loader = (status) => status ? $('.loader').removeClass('d-none') :  setTimeout(() => $('.loader').addClass('d-none'), 500);

window.addEventListener("load", async () => {
    console.log("⌛ Loading...");
    
    await connectCeloWallet();
    
    await checkOwner();

    await loadJokes();
});

// modal initializing
var add_new_joke_modal = new bootstrap.Modal(document.getElementById('add-new-joke'));
var add_new_category = new bootstrap.Modal(document.getElementById('add-new-category'));

let user_jokes = [];

// class of a joke that is identical to contract's struct
class Joke {
    constructor(title, content, category_id, user, create_timestamp) {
        this.title = title;
        this.content = content;
        this.category_id = category_id;
        this.user = user;
        this.create_timestamp = create_timestamp;
    }
}

// render categories on the joke modal window
const renderCategories = async () => {
    loader(true);
    const categories = await contract.methods.allCategories().call();

    $('#select_category').empty();

    for (let index in categories)
        $('#select_category').append(`<option value="${index}">${categories[index]}</option>`);

    loader(false);
}

// add new joke event
$('#add_joke').click(async () => {
    loader(true);

    $('.modal-title').html('Create a joke');

    await renderCategories();

    // unset fields on the modal
    $('#joke-title').val('');
    $('#joke-content').val('');

    $('#save_joke').attr('data-action', '');

    loader(false);

    add_new_joke_modal.show();
});

// save updated/created joke event
$('#save_joke').click(async function () {

    loader(true);

    let index;

    // if element has data-action then update an existing joke
    if (index = $(this).attr('data-action')) {

        let element = user_jokes.find((el) => el.index === parseInt(index));

        const joke = new Joke(
            $('#joke-title').val(),
            $('#joke-content').val(),
            $('#select_category option:selected').val(),
            kit.defaultAccount,
            element.joke.create_timestamp
        );

        await contract.methods.updateJoke(index, joke).send({ from: kit.defaultAccount }).then(async function () {
            await loadJokes();
            add_new_joke_modal.hide();
        });

    } else {
        const create_timestamp = Date.now();

        const joke = new Joke($('#joke-title').val(), $('#joke-content').val(), $('#select_category option:selected').val(), kit.defaultAccount, create_timestamp);

        await contract.methods.addJoke(joke).send({ from: kit.defaultAccount }).then(async function () {
            await loadJokes();
            add_new_joke_modal.hide();
        });
    }

    loader(false);

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

// add new category event
$('#category_').submit(async (e) => {
    loader(true);
    e.preventDefault();

    const title = $('#category_title').val();

    await contract.methods.addCategory(title).send({ from: kit.defaultAccount });

    loader(false);

    add_new_category.hide();
});

// check if a user is an owner
const checkOwner = async () => {

    // add a button to add a category
    if (await contract.methods.isOwner().call()) {
        $($('.buts')[0]).append('<button type="button" id="add_category" class="btn btn-dark">Add a category</button>');
    }

    // add category button event
    $('#add_category').click(() => {
        add_new_category.show();
    });
}

// template of a joke
export const jokeTemplate = (address, index, category, like, dislike) => {

    const owner = address === kit.defaultAccount;

    // if a user is an owner add two columns to update and delete a joke
    const col = owner ? "col-md-3" : "col-md-6";

    return `<div class="row actions">
        <div class="${col} text-center">
            <button type="button" class="btn btn-mkn2 btn-sm like" data-index="${index}"><i class="fas fa-thumbs-up"></i></button>
            <span>${like}</span>
        </div>
        <div class="${col} text-center">
            <button type="button" class="btn btn-mkn3 btn-sm dislike" data-index="${index}"><i class="fas fa-thumbs-down"></i></button>
            <span>${dislike}</span>
        </div>
        ${owner ?
            `<div class="col-md-3 text-center">
                <button type="button" class="btn btn-mkn2 btn-sm edit-joke" data-index="${index}"><i class="fas fa-edit"></i></button>
            </div>    
        
            <div class="col-md-3 text-center">
                <button type="button" class="btn btn-mkn2 btn-sm remove-joke" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
            </div>`
            : ''
        }
    </div>
    <div class="row">
        <span class="text-end">Category - <a href=""> #${category} </a></span>
    </div>`;
}

// get get param from url
$.urlParam = (name) => {
    const results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);

    try {
        return results[1] || 0;
    } catch (e) {
        return undefined;
    }
}

// load all jokes of a user
const loadJokes = async () => {
    const jokes = await contract.methods.allJokes().call();

    // get address from an url or a wallet
    const address = $.urlParam('address') || kit.defaultAccount;

    $('#address').html(address);

    if (kit.defaultAccount !== address) {
        $('#row_add_joke').remove();
        $('.modal.profile-modal').remove();
        $('.modal.profile-modal').remove();
    }

    user_jokes = [];

    jokes.forEach((el, i) => {
        if (el.user === address)
            user_jokes.unshift({ joke: el, index: i });
    });

    let first_joke;

    $('#table_jokes_added').html(user_jokes.length);

    if (!user_jokes.length) {
        $('.profile_jokes .card .card-header h5').html("You have no jokes");
    }

    var total_likes = 0, total_dislikes = 0;

    var ratings = [], spec = [];
    
    // get ratings from a user
    await $.get({
        url: `http://localhost:4000/getratings?address=${kit.defaultAccount}`,
        success: (data) => ratings = data.ratings
    });

    if (first_joke = user_jokes[0]) {

        const category = await contract.methods.getCategory(first_joke.joke.category_id).call();

        // ratings from a specific joke
        await $.get({
            url: `http://localhost:4000/getratings?index=${first_joke.index}`,
            success: (data) => spec = data
        });

        // total likes and dislikes of a joke
        total_likes += spec.likes;
        total_dislikes += spec.dislikes;

        $('#first_joke').html(`
            <h5 class="card-title">${first_joke.joke.title}</h5>
            <p class="card-text">${first_joke.joke.content}</p>
            ${jokeTemplate(address, first_joke.index, category, spec.likes, spec.dislikes)}
        `);

        if (ratings.likes.includes(parseInt(first_joke.index)))
            $($(`button.like[data-index="${first_joke.index}"`)[0]).addClass("selected");

        if (ratings.dislikes.includes(parseInt(first_joke.index)))
            $($(`button.dislike[data-index="${first_joke.index}"`)[0]).addClass("selected");
    }

    $('#user_jokes').empty();

    for (let index in user_jokes) {
        const category = await contract.methods.getCategory(user_jokes[index].joke.category_id).call();

        if (index != 0) {
            const joke_index = user_jokes[index].index;

            await $.get({
                url: `http://localhost:4000/getratings?index=${joke_index}`,
                success: (data) => spec = data
            });

            total_likes += spec.likes;
            total_dislikes += spec.dislikes;

            $('#user_jokes').append(`
                <div class="row my-2">
                    <div class="card col-md-6 mx-auto p-0">

                        <div class="card-body">
                        <h5 class="card-title">${user_jokes[index].joke.title}</h5>
                        <p class="card-text">${user_jokes[index].joke.content}</p>
                        ${jokeTemplate(address, joke_index, category, spec.likes, spec.dislikes)}
                        </div>
                    </div>
                </div>
            `);

            if (ratings.likes.includes(parseInt(joke_index)))
                $($(`button.like[data-index="${joke_index}"`)[0]).addClass("selected");

            if (ratings.dislikes.includes(parseInt(joke_index)))
                $($(`button.dislike[data-index="${joke_index}"`)[0]).addClass("selected");
        }
    }

    loader(false);

    // joke like event
    $('.like').on('click', function () {
        loader(true);
        $.get({
            url: `http://localhost:4000/setrating?address=${kit.defaultAccount}&action=like&index=${$(this).attr("data-index")}`
        }).done(async (data) => {
            return await loadJokes();
        })
    });

    // joke dislike event
    $('.dislike').on('click', function () {
        loader(true);
        $.get({
            url: `http://localhost:4000/setrating?address=${kit.defaultAccount}&action=dislike&index=${$(this).attr("data-index")}`
        }).done(async (data) => {
            return await loadJokes();
        })
    });

    // setting a statistics of a user
    $('#table_total_likes').html(total_likes);
    $('#table_total_dislikes').html(total_dislikes);
    $('#table_rating').html(total_likes - total_dislikes);

    // edit joke event
    $('.edit-joke').click(async function () {

        $('.modal-title').html('Edit a joke');

        let element = user_jokes.find((el) => el.index === parseInt($(this).attr('data-index')));

        $('#joke-title').val(element.joke.title);

        $('#joke-content').val(element.joke.content);

        await renderCategories();

        $("select#select_category").val(element.joke.category_id);

        $('#save_joke').attr('data-action', element.index);

        add_new_joke_modal.show();
    });

    // remove joke event
    $('.remove-joke').click(async function () {
        await contract.methods.removeJoke($(this).attr('data-index')).send({ from: kit.defaultAccount });

        await loadJokes();
    });

}