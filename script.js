const {create} = require('xmlbuilder2');
const {readFileSync, writeFileSync} = require('fs');

function getTranslationObj(item) {
    const translationObj = {
        'idx:orth': {
            '@value': item.en,
            b: item.en,
        },
    };
    const strArray = item.bn.split(", ");
    if (strArray.length > 1) {
        // translationObj.ol = strArray.map(_item => ({
        //     li: _item
        // }))
        translationObj.ol = [
            {
                li: "ss"
            }
        ]
        // console.log(translationObj);

    } else {
        translationObj.p = item.bn
    }
    return translationObj;
}

try {
    const dataRaw = readFileSync('./data/e2b-data.json', {encoding: 'utf8'});
    const dictionaryData = JSON.parse(dataRaw.toString());
    let doc = create();
    doc = doc.ele('html', {
        'xmlns:math': "http://exslt.org/math",
        'xmlns:svg': "http://www.w3.org/2000/svg",
        'xmlns:tl': "https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf",
        'xmlns:saxon': "http://saxon.sf.net/",
        'xmlns:xs': "http://www.w3.org/2001/XMLSchema",
        'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
        'xmlns:cx': "https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf",
        'xmlns:dc': "http://purl.org/dc/elements/1.1/",
        'xmlns:mbp': "https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf",
        'xmlns:mmc': "https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf",
        'xmlns:idx': "https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf",
    }).ele('head')
        .ele('meta', {'http-equiv': 'Content-Type', 'content': "text/html; charset=utf-8"}).up()
        .ele('title').txt('E2B Dictionary').up()//head
        .up()//html
        .ele('body')
        .ele('mbp:frameset')

    dictionaryData.map((item) => {
        doc = doc.ele('idx:entry', {'name': 'default', 'spell': 'yes', 'scriptable': 'yes'})
            .ele('idx:short')
            .ele('idx:orth', {'value': item.en})
            .ele('b').txt(item.en).up()
            .up() // idx:orth
        const strArray = item.bn.split(", ");
        if (strArray.length > 1) {
            doc = doc.ele('ol')
            strArray.map(_item => {
                doc = doc.ele('li').txt(_item).up();
            })
            doc = doc.up() // ol
                .up() //idx:short
                .up() //idx:entry
        } else {
            doc = doc.ele('p').txt(item.bn).up()
                .up() //idx:short
                .up() //idx:entry
        }

    })
    // const root = create({
    //     html: {
    //         '@xmlns:math': "http://exslt.org/math",
    //         '@xmlns:svg': "http://www.w3.org/2000/svg",
    //         '@xmlns:tl': "https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf",
    //         '@xmlns:saxon': "http://saxon.sf.net/",
    //         '@xmlns:xs': "http://www.w3.org/2001/XMLSchema",
    //         '@xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
    //         '@xmlns:cx': "https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf",
    //         '@xmlns:dc': "http://purl.org/dc/elements/1.1/",
    //         '@xmlns:mbp': "https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf",
    //         '@xmlns:mmc': "https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf",
    //         '@xmlns:idx': "https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf",
    //         head: {
    //             meta: {
    //                 '@http-equiv': 'Content-Type',
    //                 '@content': "text/html; charset=utf-8"
    //             }
    //         },
    //         body: {
    //             'mbp:frameset': dictionaryData.map((item, index) => ({
    //                 'idx:entry': {
    //                     '@name': 'default',
    //                     '@spell': 'yes',
    //                     '@scriptable': 'yes',
    //                     'idx:short': getTranslationObj(item)
    //                 }
    //             }))
    //         }
    //     }
    // }, {headless: true}); // Setting headless to true ensures that a document type declaration is not added automatically

    // Convert XML to string
    const xmlString = doc.end({prettyPrint: true});
    writeFileSync('e2b-dictionary.xhtml', xmlString);

} catch (err) {
    console.log("Error parsing JSON string:", err);
}

