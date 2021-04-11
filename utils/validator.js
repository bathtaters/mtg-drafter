// Validation for user input
const { body, validationResult, cookie, param } = require('express-validator')

// Modifiable Validation Ranges
const limits = {
    // Generic
    base64id: { min: 16, max: 16 },         // chars in sessionId/playerId

    // Setup Page
    draftType: ['cubeType','boosterType'],  // enum
    draftName: { max: 30 },                 // char limit
    playerCount: { min: 2, max: 16 },       // int range
    packCount: { min: 1, max: 10 },         // int range (Also applies to setCode array)
        // packCount => Must also update limits in "setup-listeners.add/removeBoosterPack"
    packSize: { min: 1, max: 20 },          // int range
    setCode: { min: 3, max: 4 },            // chars in setCodes
    //cubeFile: {},                         // settings for file import

    // Draft actions
    draftId: { min: 24, max: 24 },          // chars in draftId (ObjID)
    playerName: { max: 22 },                // char limit
    landKeys: { min: 6, max: 6 },           // char count (ie. 'main-w')
    landCounts: { min: 0, max: 999 }        // int range
};

// Cookie middleware (Session/Player)
const cookieRules = () => [
  param('sessionId').optional().isLength(limits.base64id).isBase64({urlSafe: true}),
  cookie('sessionId').optional().isLength(limits.base64id).isBase64({urlSafe: true}),
  cookie('playerId').optional().isLength(limits.base64id).isBase64({urlSafe: true})
];

// Draft setup
const draftSetupRules = () => [
  body('draftType').isIn(limits.draftType),
  body('draftName').default('New Draft').isAscii().bail().stripLow(false).isLength(limits.draftName).escape(),
  body('playerCount').isInt(limits.playerCount),
  body('packCount').optional().isInt(limits.packCount),
  body('packSize').optional().isInt(limits.packSize),
  body('setCode').optional().customSanitizer(strToArray).isArray(limits.packCount).withMessage('Is not array or too long'),
  body('setCode.*').isAlphanumeric().withMessage('Contains invalid characters').isLength(limits.setCode).withMessage('Invalid length'),
  //body('cubeFile'), // settings for file import
  body('cubeData').optional().isBase64({urlSafe: true})
];

// Draft actions
const draftRules = {
  // upload: () => { return [
  //   body('cubeFile'),
  // ];},
  pick: () => [
    body('draftId').optional().isLength(limits.draftId).isHexadecimal()
  ],
  swap: () => [
    body('draftId').isLength(limits.draftId).isHexadecimal(),
    body('fromSide').isBoolean()
  ],
  rename: () => [
    body('name').isAscii().bail().stripLow(false).trim().isLength(limits.playerName).escape(),
  ],
  lands: () => [
    body('landCount.*._id').isString().isLength(limits.landKeys),
    body('landCount.*.count').isInt(limits.landCounts)
  ]
};


// Custom sanitizers
const strToArray = value => {
  return typeof value == 'string' ? [value] : value;
};


// Deal with result
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push( err.param+': '+err.msg ));
  console.error(errors);

  return res.status(422).send(
    'INPUT ERRORS = { '+extractedErrors.join(', ')+' }'
  );
};
  
module.exports = {
  limits,  
  cookieRules,
  draftSetupRules,
  draftRules,
  validate
};