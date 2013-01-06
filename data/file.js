/**
 * @name CeL file system functions
 * @fileoverview 本檔案包含了 file system functions。
 * @since 2013/1/5 9:38:34
 * @see <a href="http://en.wikipedia.org/wiki/Filesystem" accessdate="2013/1/5
 *      9:44">File system</a>
 */

'use strict';
if (typeof CeL === 'function')
	CeL
			.run({
				name : 'data.file',
				require : 'data.code.compatibility.|application.OS.Windows.new_COM|data.code.thread.Serial_execute',
				code : function(library_namespace) {

					// requiring.
					var new_COM, Serial_execute;
					eval(this.use());

					var
					//
					path_separator = library_namespace.env.path_separator,
					/**
					 * FileSystemObject
					 * 
					 * @inner
					 * @ignore
					 * @see <a
					 *      href="http://msdn.microsoft.com/en-us/library/z9ty6h50(v=VS.84).aspx"
					 *      accessdate="2010/1/9 8:10">FileSystemObject Object</a>,
					 *      Scripting Run-Time Reference/FileSystemObject
					 *      http://msdn.microsoft.com/en-US/library/hww8txat%28v=VS.84%29.aspx
					 */
					FSO = new_COM("Scripting.FileSystemObject");

					var
					// const type: (!!type) MUST true!
					FILE = 1, FOLDER = 2,

					// const index
					FILE_HANDLER_INDEX = 0, FOLDER_HANDLER_INDEX = 1,

					// const: sub files.
					// 必須是不會被用於檔案、目錄名之值。
					FILES = '',
					// TODO: file/directory status/infomation, even contents.
					// 必須是不會被用於檔案、目錄名之值。
					DATA = '.',

					// a network drive.
					// http://msdn.microsoft.com/en-us/library/ys4ctaz0(v=vs.84).aspx
					NETWORK_DRIVE = 3;

					/**
					 * 取得指定 path 之檔名/資料夾名稱。
					 * 
					 * @param {String}path
					 *            指定之目標路徑。
					 * @returns {String} 檔名/資料夾名稱。
					 * @inner
					 */
					function name_of_path(path) {
						var match = typeof path === 'string'
								&& path.match(/[^\\\/]+/);
						return match && match[0] || path || '';
					}

					/**
					 * 取得裸 Object (naked Object)。
					 * 
					 * @returns 裸 Object (naked Object)。
					 */
					var null_Object = function() {
						return Object.create(null);
					};

					try {
						null_Object();
					} catch (e) {
						null_Object = function() {
							return {};
						};
					}

					/**
					 * 傳回新的資料夾結構。
					 * 
					 * @returns 新的資料夾結構。
					 * @inner
					 */
					function new_folder() {
						var f = null_Object();
						// 檔案, sub-files.
						f[FILES] = {};
						return f;
					}

					/**
					 * 建立模擬檔案系統結構 (file system structure) 之 JavaScript Object。
					 * 
					 * @example <code>
					 * CeL.run('data.file', function() {
					 * 	var folder = new CeL.file_system_structure('D:\\a');
					 * 	folder.each(function(fso, type) {
					 * 		CeL[type ? 'log' : 'info'](fso.Path); }, {
					 * 			filter : 'f',
					 * 			'final' : function() { CeL.log('done'); }
					 * 		}
					 * 	);
					 * });
					 * </code>
					 * 
					 * @param {String|Array}path
					 *            指定之目標路徑。
					 * @param {Object}[options]
					 *            optional flag. filter / type
					 * 
					 * @constructor
					 * 
					 * @see <a
					 *      href="http://msdn.microsoft.com/library/en-US/script56/html/0fa93e5b-b657-408d-9dd3-a43846037a0e.asp">FileSystemObject</a>
					 * 
					 * @since 2013/1/6 18:57:16 可用。
					 */
					function file_system_structure(path, options) {
						this.structure = new_folder();
						this.path_list = [];

						this.add(path, options);
					}

					/**
					 * 取得模擬結構中，指定 path 所在位置。
					 * 
					 * @param {String}path
					 *            指定之目標路徑。
					 * 
					 * @returns {Object} 指定 path 所在位置。
					 */
					function resolve_path(path, create_type) {
						var base = this.structure;

						if (path && typeof path === 'string')
							for ( var name, i = 0, list = library_namespace
									.simplify_path(path)
									.replace(/[\\\/]+$/, '').split(/[\\\/]+/); i < list.length; i++) {
								name = list[i];
								if (name in base)
									base = base[name];
								else if (!create_type)
									return;

								else if (list.length > 0
										|| create_type === FOLDER)
									base = base[name] = new_folder();
								else
									base[FILES][name] = null;
							}

						return base;
					}

					function fit_filter(name, filter) {
						return !filter
								|| (typeof filter === 'string' ? name
										.indexOf(filter) !== -1 : filter
										.test(name));
					}

					/**
					 * 將指定 path 加入模擬結構。<br />
					 * 
					 * @param {String|Array}path
					 *            指定之目標路徑。
					 * @param {Object}[options]
					 *            optional flag. filter / type
					 */
					function add_path(path, options) {
						library_namespace.debug('初始化+正規化。', 2, 'add_path');
						if (!library_namespace.is_Object(options))
							options = null_Object();
						if (isNaN(options.depth) || options.depth < 0)
							options.depth = 1024;

						if (Array.isArray(path)) {
							path.forEach(function(p) {
								this.add(p, options);
							}, this);
							return;
						}

						var base = this.structure;
						if (!path) {
							library_namespace.debug('取得各個 driver code。', 2,
									'add_path');
							for ( var driver, drivers = new Enumerator(
									FSO.Drives); !drivers.atEnd(); drivers
									.moveNext()) {
								driver = drivers.item();
								// http://msdn.microsoft.com/en-us/library/ts2t8ybh(v=vs.84).aspx
								if (driver.IsReady)
									base[driver.Path] = new_folder();
								else
									library_namespace.warn('add_path: Drive ['
											+ driver.Path + '] 尚未就緒！');
							}

							return;
						}

						var fso,
						// 類型
						type;
						// 轉換輸入之 path 成 FSO object。
						if (typeof path === 'string') {
							if (FSO.FolderExists(path)) {
								fso = FSO.GetFolder(path);
								type = FOLDER;
							} else if (FSO.FileExists(path)) {
								fso = FSO.GetFile(path);
								type = FILE;
							}

						} else if (typeof path === 'object' && path.Path) {
							fso = isNaN(path.DriveType) ? path : FSO
									.GetFolder(path.Path);
							type = fso.SubFolders ? FOLDER : FILE;
						}

						if (typeof fso !== 'object' || !(path = fso.Path)) {
							library_namespace.warn('add_path: 無法判別 path ['
									+ path + ']！指定的文件不存在？');
							return;
						}

						var list = this.path_list;
						for ( var i = 0; i < list.length; i++)
							if (list[i].startsWith(path)) {
								library_namespace.debug('已處理過 path [' + path
										+ ']。', 2, 'add_path');
								return;
							}

						library_namespace.debug('Adding [' + path + ']', 2,
								'add_path');
						list.push(path);

						base = this.get(path, type);

						var traverse = function(fso, base, depth) {
							// 自身已經處理完，接下來 sub-files/sub-folders 之 depth 皆 +1。
							depth++;

							var item, collection, filter = options.filter, name;
							library_namespace.debug('巡覽 [' + fso.Path
									+ '] 之 sub-files。', 2, 'add_path');
							for (collection = new Enumerator(fso.Files); !collection
									.atEnd(); collection.moveNext()) {
								item = collection.item();
								if (fit_filter(name = item.Name, filter)) {
									library_namespace.debug('Adding sub-file ['
											+ item.Path + ']', 3, 'add_path');
									base[FILES][name] = null;
								}
							}

							library_namespace.debug('巡覽 [' + fso.Path
									+ '] 之 sub-folders。', 2, 'add_path');
							for (collection = new Enumerator(fso.SubFolders),
									filter = options.folder_filter; !collection
									.atEnd(); collection.moveNext()) {
								item = collection.item();
								if (fit_filter(name = item.Name, filter)) {
									library_namespace.debug(
											'Adding sub-folder [' + item.Path
													+ ']', 3, 'add_path');
									name = base[name] = new_folder();
									if (depth <= options.depth)
										traverse(item, name, depth);
								}
							}
						};

						if (type === FOLDER && options.depth > 0) {
							library_namespace.debug('開始巡覽。', 2, 'add_path');
							traverse(fso, base, 0);
						}
					}

					/**
					 * 重新整理/同步模擬結構。
					 * 
					 * @param {String|Array}path
					 *            指定之目標路徑。
					 * @param {Object}[options]
					 *            optional flag. filter / type
					 */
					function refresh_structure(path, options) {
						// TODO: 勿 reset。
						this.structure = new_folder();

						this.path_list.forEach(function(path) {
							this.add(path, options);
						}, this);
					}

					/**
					 * 當呼叫 JSON.stringify() 時的前置處理。
					 */
					function structure_to_JSON(key) {
						// hierarchy:
						// {
						// FILES:[],
						// DATA:{},
						// 資料夾名稱(sub directory name):{}
						// };
						var structure = null_Object(),
						//
						traverse = function(folder, base) {
							if (folder[FILES].length)
								base[FILES] = folder[FILES];

							for ( var name in folder)
								if (name !== FILES && name !== DATA)
									traverse(folder[name],
											base[name] = null_Object());
						};

						traverse(this.structure, structure);

						return structure;
					}

					/**
					 * 巡覽/遍歷檔案系統模擬結構時，實際處理的函數。
					 * 
					 * @param {Array}LIFO_stack
					 *            處理堆疊。
					 * @param {file_system_structure}_this
					 *            file_system_structure instance.
					 * @param {Array}callback_array
					 *            [file handler, folder handler]
					 * @param {Object}options
					 *            optional flag. filter / type
					 * 
					 * @inner
					 * @private
					 * 
					 * @since 2013/1/6 18:57:16 可用。
					 */
					function travel_handler(LIFO_stack, _this, callback_array,
							options) {

						// 每個 folder 會跑一次 travel_handler。

						// 處理順序:
						// 處理/執行 folder 本身
						// → expand sub-files
						// → 處理/執行 sub-files (若檔案過多會跳出至下一循環處理)
						// → expand sub-folders
						// → 下一循環 from sub-folder[0]。

						var max_count = options.max_count, stack, base_path, path, name, depth;

						if (LIFO_stack.length > 0) {
							var callback, fso;
							stack = LIFO_stack[LIFO_stack.length - 1];
							// 若有設定 stack.path，必以 path_separator 作結。
							base_path = stack.path || '';

							while (!stack.is_file && stack.index < stack.length) {
								name = stack[stack.index++];
								// 若有設定 stack.path，必以 path_separator 作結。
								path = base_path + name + path_separator;
								library_namespace.debug('處理/執行 folder [' + path
										+ '] 本身。', 2, 'travel_handler');
								/**
								 * fso: 資料夾。
								 * 
								 * @see <a
								 *      href="http://msdn.microsoft.com/en-us/library/1c87day3(v=vs.84).aspx"
								 *      accessdate="2013/1/5 12:43">Folder
								 *      Object</a>
								 */
								if (fso = FSO.GetFolder(path)) {
									base_path = path;
									// 判別是否在標的區域內。
									// depth: 正處理之 folder 本身的深度。
									if (isNaN(depth = stack.depth))
										if (stack.length > 1) {
											stack.depth = depth = 0;
										} else
											for ( var i = 0, path_list = _this.path_list; i < path_list.length; i++)
												if (path
														.startsWith(path_list[i])) {
													stack.depth = depth = 0;
													break;
												}
									if (!isNaN(depth)
											&& (callback = callback_array[FOLDER_HANDLER_INDEX])
											&& fit_filter(name,
													options.folder_filter))
										// 處理/執行 folder 本身
										callback.call(this, fso,
												FOLDER_HANDLER_INDEX, depth);

									// expand sub-files.
									// TODO: check fso.SubFolders
									if (callback_array[FILE_HANDLER_INDEX]
											&& depth < options.depth) {
										stack = [];
										for (name in _this.get(path)[FILES])
											stack.push(name);
										if (stack.length > 0) {
											if (options.sort)
												if (typeof options.sort === 'function')
													stack.sort(options.sort);
												else
													stack.sort();

											library_namespace
													.debug('開始處理 [' + base_path
															+ '] 之'
															+ stack.length
															+ ' sub-files ['
															+ stack + '].', 2,
															'travel_handler');
											stack.index = 0;
											stack.path = path;
											stack.depth = depth + 1;
											stack.is_file = true;
											LIFO_stack.push(stack);
										}
									}
									// 預防有 sub-folder，還是先 break;
									break;

								} else {
									library_namespace
											.warn('travel_handler: 無法 get path ['
													+ path + ']！您可能需要 refresh？');
								}
							}

							// depth: 正處理之 files 的深度。
							depth = stack.depth;
							callback = callback_array[FILE_HANDLER_INDEX];
							if (stack.is_file) {
								library_namespace.debug('處理/執行 folder ['
										+ base_path + '] 的 sub-files。', 2,
										'travel_handler');
								// main loop of file.
								for ( var filter = options.filter;;)
									if (stack.index < stack.length) {
										if (fit_filter(
												name = stack[stack.index++],
												filter)) {
											path = base_path + name;

											/**
											 * fso: 檔案。
											 * 
											 * @see <a
											 *      href="http://msdn.microsoft.com/en-us/library/1ft05taf(v=vs.84).aspx"
											 *      accessdate="2013/1/5
											 *      12:43">File Object</a>
											 */
											var fso = FSO.GetFile(path);
											if (fso) {
												// 處理/執行 sub-files
												callback.call(this, fso,
														FILE_HANDLER_INDEX,
														depth);
												if (--max_count < 0)
													return;
											} else {
												library_namespace
														.warn('travel_handler: 無法 get path ['
																+ path
																+ ']！您可能需要 refresh？');
											}
										}
									} else {
										// 去掉 sub-files 之stack。
										LIFO_stack.pop();
										break;
									}
							}

						}

						if (base_path)
							library_namespace.debug('已處理過 folder [' + base_path
									+ '] 本身與 sub-files。expand sub-folders.', 2,
									'travel_handler');
						else
							base_path = '';

						// depth: 正處理之 folder 本身的深度。
						depth = LIFO_stack.length > 0 ? LIFO_stack[LIFO_stack.length - 1].depth
								: undefined;
						if (isNaN(depth) || depth < options.depth) {
							// expand sub-folders.
							stack = [];
							for (name in _this.get(base_path))
								if (name !== FILES && name !== DATA)
									stack.push(name);

							if (stack.length > 0) {
								if (options.sort)
									if (typeof options.sort === 'function')
										stack.sort(options.sort);
									else
										stack.sort();

								// sub-folders / sub-directory.
								library_namespace.debug('開始處理 [' + base_path
										+ '] 之 ' + stack.length + ' 個子資料夾 ['
										+ stack + '].', 2, 'travel_handler');
								stack.index = 0;
								stack.path = base_path;
								if (!isNaN(depth))
									stack.depth = depth + 1;
								LIFO_stack.push(stack);
								return;
							}

							if (!base_path) {
								// 應該只有 structure 為空時會用到。
								library_namespace
										.warn('travel_handler: structure 為空？');
								return this.finish();
							}
						}

						// 檢查本 stack 是否已處理完畢。
						while ((stack = LIFO_stack[LIFO_stack.length - 1]).index === stack.length) {
							library_namespace.debug('Move up. stack.length = '
									+ LIFO_stack.length, 2, 'travel_handler');
							LIFO_stack.pop();
							if (LIFO_stack.length === 0)
								return this.finish();
						}

					}

					/**
					 * travel structure.<br />
					 * 巡覽/遍歷檔案系統模擬結構的 public 函數。
					 * 
					 * TODO:<br />
					 * 計數+進度。<br />
					 * deal with throw
					 * 
					 * @param {Function|Array}callback
					 *            file system handle function array.
					 * @param {Object}[options]
					 *            optional flag. filter / type
					 * 
					 * @returns {Serial_execute} controller
					 * 
					 * @since 2013/1/6 18:57:16 可用。
					 */
					function for_each_FSO(callback, options) {

						var path_length = this.path_list.length;
						if (path_length === 0) {
							if (library_namespace.is_debug())
								library_namespace
										.warn('for_each_FSO: 尚未設定可供巡覽之 path。');
							return;
						}

						library_namespace.debug('初始化+正規化。', 2, 'for_each_FSO');
						if (!library_namespace.is_Object(options))
							options = null_Object();

						if (typeof callback === 'function')
							callback = [ callback, callback ];

						if (typeof options.sort !== 'function'
								&& !(options.sort = !!options.sort))
							delete options.sort;

						// file filter.
						// WARNING: 只要檔名不符合，即使 folder name 符合亦一樣會被剔除！
						if ('filter' in options) {
							if (!options.filter
									|| typeof options.filter !== 'string'
									&& !library_namespace
											.is_RegExp(options.filter))
								delete options.filter;
						}

						// folder filter.
						if ('folder_filter' in options) {
							if (!options.folder_filter
									|| typeof options.folder_filter !== 'string'
									&& !library_namespace
											.is_RegExp(options.folder_filter))
								delete options.folder_filter;
						}

						if (isNaN(options.depth) || (options.depth |= 0) < 0
								|| options.depth > 1024)
							// 最多處理之層數。
							options.depth = 1024;

						if (isNaN(options.max_count)
								|| (options.max_count |= 0) < 1
								|| options.max_count > 1e5)
							// 一次 thread 最多處理之檔案個數。
							options.max_count = 800;

						options.argument = [ [], this, callback, options ];

						library_namespace.debug('開始巡覽 ' + path_length
								+ ' paths。', 2, 'for_each_FSO');
						return new Serial_execute(travel_handler, options);
					}

					// public interface.
					library_namespace.extend({
						get : resolve_path,
						add : add_path,
						each : for_each_FSO,
						refresh : refresh_structure,
						toJSON : structure_to_JSON
					}, file_system_structure.prototype);

					return {
						file_system_structure : file_system_structure
					};
				}

			});
