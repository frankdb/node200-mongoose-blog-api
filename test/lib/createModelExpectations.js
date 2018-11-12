module.exports = function createModelExpectations (expect, u, expectedModel) {
    Object
        .keys(expectedModel)
        .forEach(function (key) {
            switch (typeof expectedModel[key]) {
                case 'function':
                    expect(u[key]).to.be.instanceOf(expectedModel[key]);
                    break;
                case 'object':
                    createModelExpectations(expect, u[key], expectedModel[key]);
                    break;
                default:
                    expect(typeof u[key]).to.equal(expectedModel[key]);
                    break;
            }
        });
}