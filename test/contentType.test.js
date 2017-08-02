const expect = require('expect');
const {getContentType, DEFAULT_CONTENT_TYPE} = require('../src/helpers/contentType.js');

describe('List Test', () => {
    describe('getContentType', () => {
        it('test function getContentType with string param', () => {
            const body = 'testNode';

            expect(getContentType(body)).toEqual(DEFAULT_CONTENT_TYPE.text);

        });

        it('test function getContentType with json param', () => {
            const body = {
                options: {
                    json: JSON.parse('{"p": 5}')
                }
            }
            expect(getContentType(body)).toEqual(null);

        });
    });
});
