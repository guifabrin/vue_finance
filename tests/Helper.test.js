import Helpers from "../src/Helpers"

test('Expect period add one month in january', () => {
    const { dateInit, dateEnd } = Helpers.getPeriod(2021, 0);
    expect(dateInit.toJSON()).toBe(new Date(2021, 0, 1, 0, 0, 0).toJSON());
    expect(dateEnd.toJSON()).toBe(new Date(2021, 1, 1, 0, 0, 0).toJSON());
});

test('Expect period add one month and one year in december', () => {
    const { dateInit, dateEnd } = Helpers.getPeriod(2021, 11);
    expect(dateInit.toJSON()).toBe(new Date(2021, 11, 1, 0, 0, 0).toJSON());
    expect(dateEnd.toJSON()).toBe(new Date(2022, 0, 1, 0, 0, 0).toJSON());
});