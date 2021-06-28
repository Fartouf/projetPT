const assert = require('chai').assert;
//const app = require('../index');
const verifPrix = require('../index').verifPrix;
const getDist = require('../index').getDist;


describe('App', function(){
    it('priceCheck', function(){
        let result = verifPrix(1,1,1,1,1);
        assert.equal(result, 9.6);
    });

    it('DistCheck', function(){
        let result = getDist(6.1408549908111665,46.194384746564715,6.1408549908111665,46.194384746564715);
        assert.equal(result, 0);
    });

   
});
