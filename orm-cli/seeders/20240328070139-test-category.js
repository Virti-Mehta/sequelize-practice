"use strict";

const {faker} = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const items = generateFakeItems(100)
    await queryInterface.bulkInsert(
      "Categories",
      items,
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Categories', null, {});
  },
};

const generateFakeItems = (rowsCount) => {
  const data = [];
  // console.log(faker.internet.email());
  for(let k = 0; k<rowsCount; k++ ) {
    const newItem = {
      name: faker.commerce.department(),
      categoryImage: faker.image.url(),
      status: faker.helpers.arrayElement([1,0])
    }
    data.push(newItem)
  }
  return data;
}