const contractSourceCode = `
    payable contract GameBet = 

    record bet = 
        {   betAddress  : address, 
            gameType    : string,
            teamOne     : string,
            teamTwo     : string,
            teamsUrl    : string,
            teamOneOdd  : int,
            teamTwoOdd  : int,
            gameTime    : int,
            betAmount   : int
        }

    record report = 
        {   authorAddress   :  address,
            author          :  string,
            report          :  string 
        }

    record state = 
        {   bets            : map(int, bet),
            numberOfBets    : int ,
            reports         : map(int, report),
            numberOfReports : int
        }

    entrypoint init() = 
        {   bets = {}, 
            reports = {}, 
            numberOfReports = 0,
            numberOfBets = 0 }

    entrypoint getBet(i: int) : bet = 
        switch(Map.lookup(i, state.bets))
            None => abort("There is no bet Created with this index, but you can create One thank you!")
            Some(x) => x

    entrypoint getReport(index : int) : report =
        switch(Map.lookup(index, state.reports ))
            None    => abort("No report found")
            Some(x) =>  x



    stateful entrypoint createBet(_type: string, _one: string, _two: string,  _url: string, _gameTime: int ) = 
        let bet = { betAddress = Call.caller, gameType = _type, teamOne = _one, teamTwo = _two, teamsUrl = _url, gameTime = _gameTime,  betAmount = 0 , teamOneOdd = 0, teamTwoOdd = 0}
        let i = getBetsLength() + 1
        put(state { bets[i] = bet, numberOfBets = i })

    entrypoint getBetsLength() : int =
        state.numberOfBets

    entrypoint getReportsLength() : int =
        state.numberOfReports



    stateful entrypoint makeReport( _author: string, _report: string, index: int) = 
        let report = { authorAddress = Call.caller, author = _author, report = _report}
        let i = getReportsLength() + 1
        put(state { reports[index] = report, numberOfReports = index})


        

    payable stateful entrypoint placeBet(i: int, _amount: int, oneOdd: int, twoOdd: int) =
        let bet = getBet(i)
        let updatedTeamOneOdd = bet.teamOneOdd + oneOdd
        let updatedTeamTwoOdd = bet.teamTwoOdd + twoOdd
        Chain.spend(bet.betAddress, _amount)
        let updatedBetAmount = bet.betAmount + Call.value
        let updatedBets = state.bets{ [i].betAmount = updatedBetAmount, [i].teamOneOdd = updatedTeamOneOdd, [i].teamTwoOdd = updatedTeamTwoOdd }
        put(state { bets = updatedBets})
`;

const contractAddress = 'ct_yEv5Sjympkph6cXUGw96XkY5H9VWJehg8ZFThpA14hThJ1zmb';
let client = null;
let betArray = [];
let numberOfBets = 0;

let reportArray = [];
let numberOfReports = 0;

function renderBets() {
    betArray = betArray.sort(function(x, y) {
        return y.betsPlaced = x.betsPlaced})
    let template = $('#template').html();
    Mustache.parse(template);
    let rendered = Mustache.render(template, {betArray});
    $('#betTemplate').html(rendered);
}

function renderReports() {
    let reportTemplate = $('#reportTemplate').html();
    Mustache.parse(reportTemplate);
    let renderedReport = Mustache.render(reportTemplate, {reportArray});
    $('#reportBody').html(renderedReport);
}


window.addEventListener('load', async () => {
    $('#loader').show();

    client = await Ae.Aepp();

    const contract = await client.getContractInstance(contractSourceCode, {contractAddress});
    const calledGet = await contract.call('getBetsLength', [], {callStatic: true}).catch(e => console.error(e));
    console.log('calledGet', calledGet);
  
    const decodedGet = await calledGet.decode().catch(e => console.error(e));
    console.log('decodedGet', decodedGet);
  
    
    renderBets();
    renderReports();


    $('#loader').hide();
});

jQuery("#betTemplate").on("click", ".betBtn", async function(event){
    const value = $('.betAmount').val();
    // let oddOne = $('#oneOdd').val();
    // let oddTwo = $('#twoOdd').val();
    const dataIndex = event.target.id;
    const foundIndex = betArray.findIndex(bet => bet.i == dataIndex);
    betArray[foundIndex].betsPlaced += parseInt(value, 10);
    renderBets();
});

$("#betTemplate").on("click", ".betBtn", function(){
    let oddOne = $('#oneOdd').val();
    let oddTwo = $('#twoOdd').val();
    betArray.oneOdd += Number(oddOne);
    betArray.twoOdd += Number(oddTwo);
    console.log(oddOne);
    console.log(oddTwo);
    renderBets();
});


$('#reportBtn').click(function() {
    let c_name = ($('#author').val()),
        c_report = ($('#report').val());

        reportArray.push({
        respondentName: c_name,
        respondentReport: c_report
    })
    renderReports();
});


$('#createBtn').click(async function() {
    let type = ($('#gameType').val()),
        time = ($('#timeStamp').val()),
        one = ($('#teamOne').val()),
        two = ($('#teamTwo').val()),
        url = ($('#gameUrl').val())
        

        betArray.push({
        gameType    : type,
        timeStamp   : time,
        teamOne     : one,
        teamTwo     : two,
        gameUrl     : url,
        i           : betArray.length+1,
        oneOdd      : 0,
        twoOdd      : 0,
        betsPlaced  : 0
        
    })
    renderBets();
});

