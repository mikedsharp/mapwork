﻿// /*global $,jQuery,alert,document,window,console,Worker*/
// /*jslint plusplus: true, white: true */
// var mapwork = mapwork || {};

// mapwork.worker = {
//   Init: function() {
//     'use strict';
//     mapwork.worker.compressionWorker = new Worker(
//       'Scripts/mapwork.worker.compression.js'
//     );
//     mapwork.worker.BindEvent();
//   },
//   BindEvent: function() {
//     'use strict';
//     mapwork.worker.compressionWorker.onmessage =
//       mapwork.worker.compressionWorker_ReceiveMessage;
//   },
//   compressionWorker: null,
//   compressionWorker_ReceiveMessage: function(event) {
//     'use strict';
//     mapwork.editor.environment.CompressMapData_Success(event.data);
//   }
// };
