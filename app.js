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
    roundsLog: [],
    flashResult: {
      big: true,
      red: false,
      green: true,
    },
  },
  watch: {
    result: function () {
      const vm = this;
      if (vm.result) {
        let i = 5;
        const interval = setInterval(() => {
          i--;
          (this.flashResult.big = !this.flashResult.big),
            (this.flashResult.red = !this.flashResult.red),
            (this.flashResult.green = !this.flashResult.green),
            (this.countDown = i);

          if (i == 0) {
            clearInterval(interval);
            this.started = false;
            vm.result = false;
            vm.countDown = 5;
          }
        }, 1000);
        setTimeout(() => {
          this.userHP = 100;
          this.monsterHP = 100;
          this.roundsLog = [];
          this.cooldown = 0;
          this.healCD = 0;
          this.healRdy = true;
          this.specialAbilityRdy = true;
        }, 5000);
      }
    },
  },
  computed: {
    specialRound: function () {
      return this.cooldown < 3 ? "раунда" : "раунд";
    },
    userBar: function () {
      let color = "";
      if (this.userHP < 25) {
        color = "red";
      } else if (this.userHP < 60) {
        color = "yellow";
      } else {
        color = "green";
      }
      return {
        backgroundColor: color,
        width: this.userHP + "%",
      };
    },
    monsterBar: function () {
      let color = "";
      if (this.monsterHP < 25) {
        color = "red";
      } else if (this.monsterHP < 60) {
        color = "yellow";
      } else {
        color = "green";
      }
      return {
        backgroundColor: color,
        width: this.monsterHP + "%",
      };
    },
    roundsLogReverse: function () {
      return this.roundsLog.reverse();
      // console.log(this.roundsLog.reverse());
    },
  },
  methods: {
    startGame: function () {
      return (this.started = true);
    },
    randomNum: function () {
      return Math.floor(Math.random() * 15);
    },
    crit: function (value) {
      const chance = Math.floor(Math.random() * 100);
      if (chance >= 90) {
        this.critical = true;
        console.log("critical strike");
        return (value *= 2);
      } else {
        this.critical = false;
        return value;
      }
    },
    message: function (ability) {
      if (ability == "heal") {
        alert("Лечение будет доступно через " + (2 - this.healCD) + " раунд");
      } else {
        alert(
          "Этот прием затратил слишком много риацу тебе нужно передохнуть еще "
        ) +
          (4 - this.cooldown) +
          " " +
          this.specialRound;
      }
    },
    round: function (event) {
      const userAction = event.target.id;
      if (this.cooldown == 3) {
        this.cooldown = 0;
        this.specialAbilityRdy = true;
      } else if (this.cooldown > 0) {
        this.cooldown++;
      }

      if ((this.healCD = 2)) {
        this.healCD = 0;
        this.healRdy = true;
      } else if (this.healCD > 0) {
        this.healCD++;
      }

      console.log(this.specialAbilityRdy);
      console.log(userAction);
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

      let log = {
        user: "",
        monster: "",
      };

      if (this.monsterHP <= 0) {
        this.roundsLog.push({
          user:
            this.userHeal > 0
              ? "You healed " + this.userHeal + " HP"
              : this.critical == true
              ? "You made " + this.userDMG + " (critical strike) DMG"
              : "You made " + this.userDMG + " DMG",
          monster: "Ben died",
        });
        this.monsterHP = 0;
        this.result = "YOU WON";
      } else {
        this.monster();
        this.roundsLog.push({
          user:
            this.userHeal > 0
              ? "You healed " + this.userHeal + " HP"
              : this.critical == true
              ? "You made " + this.userDMG + " (critical strike) DMG"
              : "You made " + this.userDMG + " DMG",
          monster: "Ben made " + this.monsterDMG + "DMG",
        });
        this.critical = false;
        if (this.userHP <= 0) {
          this.userHP = 0;
          this.result = "YOU LOST";
          this.roundsLog.push({
            user: "Поздравляем!!!",
            monster: "Ты умер....",
          });
        }
      }

      this.userHeal = 0;
    },
    attack: function () {
      const dmg = this.randomNum();
      console.log(dmg);
      this.userDMG = this.crit(dmg);

      return (this.monsterHP -= this.userDMG);
    },
    special: function () {
      this.specialAbilityRdy = false;
      this.cooldown = 1;
      const dmg = 20;
      console.log(dmg);
      this.userDMG = this.crit(dmg);

      return (this.monsterHP -= this.userDMG);
    },
    heal: function () {
      const heal = this.randomNum() + 5;
      console.log(heal);
      this.userHeal = heal;
      this.healCD = 1;
      (this.healRdy = false), (this.userHP += this.userHeal);
      if (this.userHP > 100) {
        return (this.userHP = 100);
      }
    },
    giveup: function () {
      this.result = "Ты сдался...";
    },
    monster: function () {
      this.monsterDMG = this.randomNum() + 7;
      return (this.userHP -= this.monsterDMG);
    },
  },
});
