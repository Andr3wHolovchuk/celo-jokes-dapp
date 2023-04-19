
// contract address
export const joke_contract = "0xd8A578EB3Dea7Fe4E5e03060CE57823cC64BAebd";

// template of a joke
export const jokeTemplate = (index, category) => {

    return `<div class="row actions">
        <div class="col-md-3 text-center">
            <button type="button" class="btn btn-mkn2 btn-sm"><i class="fas fa-thumbs-up"></i></button>
            <span>12</span>
        </div>
        <div class="col-md-3 text-center">
            <button type="button" class="btn btn-mkn3 btn-sm"><i class="fas fa-thumbs-down"></i></button>
            <span>10</span>
        </div>

        <div class="col-md-3 text-center">
            <button type="button" class="btn btn-mkn2 btn-sm edit-joke" data-index="${index}"><i class="fas fa-edit"></i></button>
        </div>    
        
        <div class="col-md-3 text-center">
            <button type="button" class="btn btn-mkn2 btn-sm remove-joke" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
        </div>
    </div>
    <div class="row">
        <span class="text-end">Category - <a href="/profile.html?c=${category}"> #${category} </a></span>
    </div>`;
}