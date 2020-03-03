let one = new Vue({
    el: '#app',
    data: () => ({
        title: "Create Bet",
        betTemplate: false,
        gameType: "",
        timeStamp: null,
        firstTeam: "",
        secondTeam: "",
        imageUrl: "",
        placeBet: 0,
    }),

    methods: {
        render: function () {
            this.betTemplate = true
            console.log(this.gameType);
            console.log(this.timeStamp);
            console.log(this.firstTeam);
            console.log(this.secondTeam);
            console.log(this.imageUrl);
            console.log(this.placeBet);
        },

        updateBet: function () {
            this.placeBet
        },
    },
});

let two = new Vue({
    el: '#reportApp',
    data: () => ({
        author: "",
        report: "",
        reportTemplate: false
    }),

    methods: {
        renderReport: function() {
            this.reportTemplate = true
        }
    },
   
});