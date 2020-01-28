import { _ } from "vue-underscore";

/*
Beer Sample bucket:

SELECT * FROM `beer-sample` LIMIT 5;

SELECT name
FROM `beer-sample`
WHERE `type` = 'brewery'
ORDER BY name

SELECT `type`, COUNT(1) AS DocCount
FROM `beer-sample`
GROUP BY `type`

SELECT brewery.name, beer.beerCount
FROM `beer-sample` AS brewery
JOIN
(SELECT brewery_id, COUNT(1) AS beerCount
FROM `beer-sample`
WHERE `type` = 'beer'
GROUP BY brewery_id) AS beer ON beer.brewery_id = meta(brewery).id
*/

const buckets = [
  {
    Bucket: "beer-sample",
    Queries: [
      {
        Name: "basicQuery",
        Label: "Basic Example",
        Query: "SELECT * FROM `beer-sample` LIMIT 5",
        CanParameterize: true,
        ParameterizedQuery: "SELECT * FROM `beer-sample` LIMIT $1",
        QueryParameters: [
          {
            Name: "$1",
            Value: 5
          }
        ]
      },
      {
        Name: "orderByQuery",
        Label: "ORDER BY",
        Query:
          "SELECT name FROM `beer-sample` WHERE `type` = 'brewery' ORDER BY name",
        CanParameterize: true,
        ParameterizedQuery:
          "SELECT name FROM `beer-sample` WHERE `type` = $1 ORDER BY $2",
        QueryParameters: [
          {
            Name: "$1",
            Value: "brewery"
          },
          {
            Name: "$2",
            Value: "name"
          }
        ]
      },
      {
        Name: "groupByQuery",
        Label: "GROUP BY Example",
        Query:
          "SELECT `type`, COUNT(1) AS DocCount" +
          "\nFROM `beer-sample`" +
          "\nGROUP BY `type`",
        CanParameterize: false,
        ParameterizedQuery: null
      },
      {
        Name: "joinQuery",
        Label: "JOIN Example",
        Query:
          "SELECT brewery.name, beer.beerCount" +
          "\nFROM `beer-sample` AS brewery" +
          "\nJOIN" +
          "\n(SELECT brewery_id, COUNT(1) AS beerCount" +
          "\nFROM `beer-sample`" +
          "\nWHERE `type` = 'beer'" +
          "\nGROUP BY brewery_id) AS beer ON beer.brewery_id = meta(brewery).id",
        CanParameterize: false,
        ParameterizedQuery: null
      }
    ],
    SampleDocId: "21st_amendment_brewery_cafe-test-beer",
    SampleDoc: {
      abv: 7.2,
      brewery_id: "21st_amendment_brewery_cafe",
      category: "North American Ale",
      description: "",
      ibu: 0,
      name: "Test beer",
      srm: 0,
      style: "American-Style India Pale Ale",
      type: "beer",
      upc: 0,
      updated: "2010-07-22 20:00:20"
    },
    Commands: [
      {
        Name: "acid-beer-sample",
        Label: "ACID - beer-sample",
        ApiUrl: "acidBS",
        Selected: false,
        Parent: null,
        InputOptions: [
          {
            Name: "newBeerId",
            Label: "Enter beerId below:",
            InputType: "INPUT",
            Hint: "{{SAMPLE_DOC_ID}}",
            Value: ""
          },
          {
            Name: "newBeer",
            Label: "Enter beer doc content below:",
            InputType: "TEXT_AREA",
            Hint: "{{SAMPLE_DOC}}",
            Value: ""
          },
          {
            Name: "breweryId",
            Label: "Enter breweryId below:",
            InputType: "INPUT",
            Hint: "21st_amendment_brewery_cafe",
            Value: ""
          }
        ],
        Info: `*** Note - make sure the brewery document has been updated to have a "beer_count" field ***
         Enter a new beer's document key and document content into the provided text areas.
         Make sure both document's content is valid JSON.  
         Order of operations: the new beer is inserted and then the new beer's brewery document will update it's beer count.
         If the "force rollback" checkbox is selected, the transaction will be forced to fail and thus roll back any changes to the documents.
         Click the "Execute Txn" button to attempt the transaction.`
      }
    ]
  }
];

export default {
  getSampleQueries(bucket) {
    let matchingBucket = _.findWhere(buckets, { Bucket: bucket });

    if (typeof matchingBucket == "undefined") {
      return null;
    }

    let sampleQueries = [
      {
        value: null,
        text: "-- Select Sample Query --"
      }
    ];

    let bucketQueries = _.map(matchingBucket.Queries, function(q) {
      return { value: q.Name, text: q.Label };
    });

    return sampleQueries.concat(bucketQueries);
    //return matchingBucket.Queries;
  },
  getSampleQuery(bucket, name) {
    let matchingBucket = _.findWhere(buckets, { Bucket: bucket });
    let query = _.findWhere(matchingBucket.Queries, { Name: name });
    return query;
  },
  getSampleDocId(bucket) {
    let matchingBucket = _.findWhere(buckets, { Bucket: bucket });
    if (matchingBucket) {
      return matchingBucket.SampleDocId;
    }
    return null;
  },
  getSampleDocument(bucket) {
    let matchingBucket = _.findWhere(buckets, { Bucket: bucket });
    if (matchingBucket) {
      return matchingBucket.SampleDoc;
    }
    return null;
  },
  getSampleCommand(bucket, commandName) {
    let matchingBucket = _.findWhere(buckets, { Bucket: bucket });
    if (matchingBucket) {
      let command = _.findWhere(matchingBucket.Commands, { Name: commandName });
      if (command) {
        return command;
      }
    }
    return null;
  }
};
