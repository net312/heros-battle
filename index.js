"use strict";
// Enum для типів героїв
var HeroType;
(function (HeroType) {
    HeroType["Warrior"] = "WARRIOR";
    HeroType["Mage"] = "MAGE";
    HeroType["Archer"] = "ARCHER";
})(HeroType || (HeroType = {}));
// Enum для типів атак
var AttackType;
(function (AttackType) {
    AttackType["Physical"] = "PHYSICAL";
    AttackType["Magical"] = "MAGICAL";
    AttackType["Ranged"] = "RANGED";
})(AttackType || (AttackType = {}));
// Лічильник ID
let currentId = 1;
// Функція створення нового героя
function createHero(name, type) {
    const baseStats = {
        [HeroType.Warrior]: { health: 120, attack: 15, defense: 10, speed: 8 },
        [HeroType.Mage]: { health: 80, attack: 25, defense: 5, speed: 12 },
        [HeroType.Archer]: { health: 100, attack: 18, defense: 7, speed: 10 },
    };
    return {
        id: currentId++,
        name,
        type,
        attackType: type === HeroType.Mage ? AttackType.Magical : type === HeroType.Archer ? AttackType.Ranged : AttackType.Physical,
        stats: baseStats[type],
        isAlive: true,
    };
}
// Функція розрахунку пошкодження
function calculateDamage(attacker, defender) {
    const attackMultiplier = attacker.attackType === AttackType.Physical ? 1 : 1.2;
    const baseDamage = Math.max(attacker.stats.attack * attackMultiplier - defender.stats.defense, 0);
    const isCritical = Math.random() < 0.2;
    const totalDamage = isCritical ? baseDamage * 2 : baseDamage;
    const remainingHealth = Math.max(defender.stats.health - totalDamage, 0);
    return {
        damage: Math.round(totalDamage),
        isCritical,
        remainingHealth: Math.round(remainingHealth),
    };
}
// Generic функція для пошуку героя в масиві
function findHeroByProperty(heroes, property, value) {
    return heroes.find((hero) => hero[property] === value);
}
// Функція проведення раунду бою між героями
function battleRound(hero1, hero2) {
    if (!hero1.isAlive || !hero2.isAlive) {
        return `${hero1.name} або ${hero2.name} вже не можуть битися!`;
    }
    const result1 = calculateDamage(hero1, hero2);
    hero2.stats.health = result1.remainingHealth;
    hero2.isAlive = hero2.stats.health > 0;
    let roundResult = `${hero1.name} завдав ${result1.damage} ${result1.isCritical ? "(Критичний удар!)" : ""} шкоди ${hero2.name}.`;
    if (!hero2.isAlive) {
        roundResult += ` ${hero2.name} загинув.`;
        return roundResult;
    }
    const result2 = calculateDamage(hero2, hero1);
    hero1.stats.health = result2.remainingHealth;
    hero1.isAlive = hero1.stats.health > 0;
    roundResult += `\n${hero2.name} завдав ${result2.damage} ${result2.isCritical ? "(Критичний удар!)" : ""} шкоди ${hero1.name}.`;
    if (!hero1.isAlive) {
        roundResult += ` ${hero1.name} загинув.`;
    }
    return roundResult;
}
// Функція для проведення бою до смерті одного з героїв
function fullBattle(hero1, hero2) {
    const results = [];
    while (hero1.isAlive && hero2.isAlive) {
        results.push(battleRound(hero1, hero2));
    }
    return results;
}
// Створення масиву героїв
const heroes = [
    createHero("Дмитро", HeroType.Warrior),
    createHero("Мерлін", HeroType.Mage),
    createHero("Леголас", HeroType.Archer),
];
// Приклад використання
console.log("=== Створені герої ===");
console.log(heroes);
console.log("\n=== Пошук героя за властивостями ===");
const foundHero = findHeroByProperty(heroes, "type", HeroType.Warrior);
console.log(foundHero);
const foundHero2 = findHeroByProperty(heroes, "attackType", AttackType.Magical);
console.log(foundHero2);
console.log("\n=== Битва 1 ===");
if (heroes[0].isAlive && heroes[1].isAlive) {
    const battleResults1 = fullBattle(heroes[0], heroes[1]);
    console.log(battleResults1.join("\n"));
}
else {
    console.log("Один або обидва герої вже загинули перед Битвою 1.");
}
console.log("\n=== Битва 2 ===");
if (heroes[1].isAlive && heroes[2].isAlive) {
    const battleResults2 = fullBattle(heroes[1], heroes[2]);
    console.log(battleResults2.join("\n"));
}
else {
    console.log("Один або обидва герої вже загинули перед Битвою 2.");
}
console.log("\n=== Статистика боїв ===");
heroes.forEach(hero => {
    console.log(`${hero.name}: ${hero.isAlive ? "Живий" : "Загинув"}, Здоров'я: ${hero.stats.health}`);
});
