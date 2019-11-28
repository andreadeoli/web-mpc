if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

var TABLE_HEIGHT = 150;
var ROW_HEADER_WIDTH = 150;

define([], function () {
  return {
    "tables":[
      {
        "name":"Vote Result",
        "element":"vote-result-hot",
        "hot_parameters":{
          "rowHeaderWidth": ROW_HEADER_WIDTH,
          "height": TABLE_HEIGHT
        },
        "rows":[
          {
            "label":"Count",
            "key":"count"
          },
        ],
        "cols":[
          [
            {
              "label":"Yes",
              "key":"yes"
            },
            {
              "label":"No",
              "key":"no"
            },
            {
              "label":"Abstain",
              "key":"abstain"
            }
          ]
        ],
        "types":[
          {
            "range":{
              "row":"*",
              "col":"*"
            },
            "type":"int",
            "min":0,
            "max_warning":10000,
            "empty":false
          }
        ],
        "excel":[
          {
            "sheet":"1.Number of Employees",
            "start":"B7",
            "end":"Q16",
            "firstrow":"Executive/Senior Level Officials and Managers"
          }
        ],
        "tooltips":[
          {
            "range":{
              "row":"*",
              "col":"*"
            },
            "tooltip":{
              "errorTitle":"Invalid Data Entry",
              "error":"Please do not input any text or leave any cells blank. If the value is zero, please input zero.",
              "warningTitle":"Warning: Data is too big",
              "warning":"Are you sure this value is correct?"
            }
          }
        ]
      },
    ],
    "totals":{
      "name":"Totals Check",
      "element":"totals-hot",
      "submit":false,
      "hot_parameters":{
        "rowHeaderWidth":100
      },
      "rows":[
        {
          "label":"Total"
        }
      ],
      "cols":[
        [
          {
            "label":"Total Number of Employees",
            "colspan":3
          }
        ],
        [
          {
            "label":"Female",
            "key":""
          },
          {
            "label":"Male",
            "key":""
          },
          {
            "label":"All",
            "key":""
          }
        ]
      ],
      "types":[
        {
          "range":{
            "row":"*",
            "col":"*"
          },
          "type":"int",
          "read_only":true
        }
      ]
    },
    'usability': [
      'data_prefilled',
      {'time_spent': ['page', 'session-area', 'vote-result-hot']},
      {'browser': ['chrome', 'edge', 'msie', 'firefox', 'opera', 'other', 'safari']},
      {'validation_errors': [
        'SESSION_KEY_ERROR',
        'SESSION_INFO_ERROR',
        'PARTICIPATION_CODE_ERROR',
        'SESSION_PARTICIPATION_CODE_SERVER_ERROR',
        'UNCHECKED_ERR',
        'GENERIC_TABLE_ERR',
        'SERVER_ERR',
        'GENERIC_SUBMISSION_ERR',
        'NAN_EMPTY_CELLS',
        'SEMANTIC_CELLS',
        'CELL_ERROR'
        ]
      }
    ],
    'cohort_selection': true,
    'cohorts': [
      {name: 'Voters'},
    ],
  }
});
