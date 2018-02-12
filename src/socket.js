var DELAY_CAP = 20000;
var transactionSocketDelay = 5000;
var current_block=0;
var donation_address='Ti7bZ2NLWyAYKWJFkdMKMYVListenkKax3';
/** @constructor */

var transactions=[];
function inArray(needle,haystack)
{
    var count=haystack.length;
    for(var i=0;i<count;i++)
    {
        if(haystack[i]===needle){return true;}
    }
    return false;
}

function show_transactions(value,type){
    setTimeout(function() {
        new Transaction(value, type);
    }, Math.random() * Math.random()* DELAY_CAP);
}

/**
 * gets details of each transaction and outputs eash transaction with the value of transaction
 * @param hash
 */

function check_transactions(hash){
    if(inArray(hash,transactions)===false){
    $.getJSON("curl.php?request=https://chainz.cryptoid.info/tzc/api.dws?q=txinfo&t=" + hash, function(data2) {
        transactions.push(hash);
        for (var i = 0; i < data2.outputs.length; i++) {
            if(data2.outputs[i].addr==donation_address){
                show_transactions(data2.outputs[i].amount, true);
            }else{
                show_transactions(data2.outputs[i].amount, false);
            }
        }
    });
    }
}

/**
 * Generates the new block box based on the total received and the information from the block details
 * Shows an Aditional transaction based on the type of Proof.
 * Requests aditional information per TX
 * @param hash
 * @param total
 * @param total_tx
 */
function get_hash_details(hash,total,total_tx){
    $.getJSON("curl.php?request=https://chainz.cryptoid.info/explorer/block.raw.dws?coin=tzc&hash=" + hash + ".js", function(data) {
        new Block(data.height, total_tx, total, data.size);
        if(data.flags=="proof-of-work"){
            show_transactions(data.mint, "POW");
        }else if(data.flags=="proof-of-stake"){
            show_transactions(data.mint, "POS");
        }
        for (var i = 0; i < data.tx.length; i++) {
            check_transactions(data.tx[i]);
        }
    });
}

/**
 * Receives hash and requests details in order to calculate the total TX OUT
 * calls hash details
 * @param hash
 */
function get_hash_total(hash){
    var total_output=0;
    $.getJSON("curl.php?request=https://chainz.cryptoid.info/explorer/block.txs.dws?coin=tzc&h=" + hash + ".js", function(data2) {
        for (var x = 0; x < data2.length; x++) {
            total_output=total_output+data2[x].v;
        }
        get_hash_details(hash,total_output,x);
    });

}

/**
 * Gets current block hash based on block ID
 * Takes the hash received and requets all data
 * @param block
 */
function get_hash(block){
    $.getJSON("curl.php?request=https://chainz.cryptoid.info/tzc/api.dws?q=getblockhash&height=" + block, function(data) {
        get_hash_total(data);
    });
}

/**
 * Gets current block height
 * requests block hash based on height
 * @constructor
 */
function TransactionSocket() {
    $.getJSON("curl.php?request=https://chainz.cryptoid.info/tzc/api.dws?q=getblockcount", function(data) {
        if (data > current_block)
        {
            current_block=data;
            get_hash(data);
        }
    });

}
/**
 * Calls the initial function every x seconds
 * To define seconds please change transactionSocketDelay value
 * IF you want it run only once call TransactionScoket directly
 */

setInterval(TransactionSocket, transactionSocketDelay);
