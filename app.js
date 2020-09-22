new Vue({
    el: "#app",
    data: {
        started: false,
        userHP: 100,
        monsterHP: 100,
        monsterDMG: 0,
        userDMG: 0,
        userHeal: 0,
        critical: false,
        cooldown: 0,
        healCD: 0,
        healRdy: true,
        specialAbilityRdy: true,
        result: false,
        countDown: 5,


    },
    watch: {
        result: function () {
            const vm = this;
            if (vm.result) {
                let i = 5;
                const interval = setInterval(() => {
                    i--;
                    this.countDown = i;

                    if (i == 0) {
                        clearInterval(interval);
                        this.started = false;
                        vm.result = false;
                        vm.countDown = 5;

                    }
                }, 1000)
                setTimeout(() => {
                    this.userHP = 100;
                    this.monsterHP = 100;

                }, 5000);
            }

        }

    },
    computed: {

        specialRound: function () {
            return (this.cooldown < 3) ? "раунда" : "раунд"

        }
    },
    methods: {
        startGame: function () {
            return this.started = true;
        },
        randomNum: function () {
            return Math.floor(Math.random() * 15);
        },
        crit: function (value) {
            const chance = Math.floor(Math.random() * 100);
            if (chance >= 90) {
                this.critical = true;
                console.log("critical strike")
                return value *= 2;

            } else {
                this.critical = false;
                return value;
            }

        },
        message: function (ability) {
            if (ability == "heal") {
                alert("Лечение будет доступно через " + (2 - this.healCD) + " раунд")
            } else {
                alert("Этот прием затратил слишком много риацу тебе нужно передохнуть еще ") + (4 - this.cooldown) + " " + this.specialRound

            }
        },
        round: function (event) {
            const userAction = event.target.id;
            if (this.cooldown == 3) {
                this.cooldown = 0;
                this.specialAbilityRdy = true;

            } else if (this.cooldown > 0) {
                this.cooldown++
            }

            if (this.healCD = 2) {
                this.healCD = 0;
                this.healRdy = true;

            } else if (this.healCD > 0) {
                this.healCD++
            }


            console.log(this.specialAbilityRdy)
            console.log(userAction)
            switch (userAction) {
                case "attack":
                    this.attack();
                    break;
                case "special-attack":
                    this.special();
                    break;
                case "heal":
                    this.heal();
                    break;
                case "give-up":
                    return this.giveup();


            }
            if (this.monsterHP <= 0) {
                this.result = "YOU WON";

            }
            this.monster();
            if (this.userHP <= 0) {
                this.result = "YOU LOST";

            }
            console.log(`user HP: ${this.userHP}, monster HP: ${this.monsterHP}`)
        },
        attack: function () {
            const dmg = this.randomNum();
            console.log(dmg)
            this.userDMG = this.crit(dmg);

            return this.monsterHP -= this.userDMG;




        },
        special: function () {
            this.specialAbilityRdy = false;
            this.cooldown = 1;
            const dmg = 20;
            console.log(dmg)
            this.userDMG = this.crit(dmg);

            return this.monsterHP -= this.userDMG;

        },
        heal: function () {
            const heal = this.randomNum() + 8;
            console.log(heal)
            this.userHeal = heal;
            this.healCD = 1;
            this.healRdy = false,

                this.userHP += this.userHeal;
            if (this.userHP > 100) {
                return this.userHP = 100;
            }

        },
        giveup: function () {
            this.result = "Ты сдался..."
        },
        monster: function () {
            this.monsterDMG = this.randomNum() + 5;
            return this.userHP -= this.monsterDMG;

        }


    }


})