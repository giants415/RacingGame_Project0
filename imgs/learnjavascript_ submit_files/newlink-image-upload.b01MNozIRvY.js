!function(e,t){e.models=e.models||{},e.models.validators={validate:function(e,t){for(var n=0;n<t.length;n++){validator=t[n],error=validator(e);if(error)return error}}},e.models.validators.StringLength=function(t,n,i){return n=Math.max(0,parseInt(n,10)),i=Math.max(0,parseInt(i,10)),function(o){var u=o.get(t);if(typeof u!="string")return e.errors.createAPIError(t,"NO_TEXT");if(u.length<n)return e.errors.createAPIError(t,"TOO_SHORT",{min_length:n});if(i&&u.length>i)return e.errors.createAPIError(t,"TOO_LONG",{max_length:i})}}}(r),!function(e){function o(){return function(){if(!window.FormData)return e.errors.create(n,e._("File upload not supported in your browser."))}}var t="/api/image_upload_s3.json",n="BAD_IMAGE_UPLOAD",r="BAD_LEASE_REQUEST",i=e._("something went wrong."),s=Backbone.Model.extend({defaults:{file:null},validators:[o()],validate:function(t){return e.models.validators.validate(this,this.validators)},sync:function(){throw new Error("Invalid action")},setLease:function(e){this.lease=e,e.fields.forEach(function(e){var t=e.name,n=e.value;n===""||n===null?this.unset(t):this.set(t,n)},this)},upload:function(){var t=this.validate();if(t){this.trigger("invalid",this,[t]);return}var r=this._toFormData();this.trigger("request",this),$.ajax({url:this.lease.action,type:"POST",contentType:!1,processData:!1,data:r,dataType:"xml",success:function(e){this.url=$(e).find("Location").text(),this.trigger("success",this,this.url)}.bind(this),error:function(t,r,s){var o;if(t.responseXML)try{var u=$(t.responseXML),a=u.find("Message").text();o=e.errors.create(n,a)}catch(f){}o||(o=e.errors.create(n,s||i)),this.trigger("error",this,[o])}.bind(this),progress:function(e){(e.loaded||e.total)&&this.trigger("progress",this,e.loaded,e.total)}.bind(this),complete:function(){this.trigger("complete",this)}.bind(this),xhr:function(){var e=$.ajaxSettings.xhr();return e instanceof window.XMLHttpRequest?e.addEventListener("progress",this.progress,!1):e.upload&&e.upload.addEventListener("progress",this.progress,!1),e}})},_toFormData:function(){var e=new FormData;for(var t in this.attributes)t!=="file"&&e.append(t,this.get(t));return e.append("file",this.get("file")),e}},{isSupported:function(){return!!window.FormData},request:function(n,o){var u=$.Deferred();return n.file?(e.ajax({url:t,type:"POST",dataType:"json",data:{filepath:n.file.name,mimetype:o,raw_json:"1"},success:function(e,t,r){var i=new s(n);i.setLease(e),u.resolve(i)},error:function(t,n,s){try{u.reject(e.errors.create(r,t.responseJSON.message))}catch(o){u.reject(e.errors.create(r,s||i))}}}),u.promise()):(u.reject(e.errors.create(r,"missing file option")),u.promise())}});e.S3ImageUploader=s}(r),!function(e){var t="file-input";e.actions.bindImageUploadOnInput=function(n,i){i=i||n,$(n).on("change",function(n){var s=n.originalEvent.target.files[0];if(!s)return;e.actions.trigger(t,{target:i,eventDetail:"file selector",file:s})})},e.actions.bindImageUploadOnPaste=function(n,i){i=i||n,$(n).on("paste",function(n){var s=n.originalEvent.clipboardData;if(!s||!s.items)return;var o=s.items[0];if(!o)return;var u=o.getAsFile();if(!u)return;if(!u.name&&u.type){var a=u.type.split("/")[1];u.name="untitled."+a}e.actions.trigger(t,{target:i,eventDetail:"clipboard",file:u}),n.preventDefault()})},e.actions.bindImageUploadOnDrop=function(n,i){i=i||n;var s;$(n).on("drop",function(o){s=null,$(n).trigger("file-input:drop");var u=o.originalEvent.dataTransfer;if(!u||!u.files)return;var a=u.files[0];if(!a)return;e.actions.trigger(t,{target:i,eventDetail:"drag and drop",file:a}),o.preventDefault()}),$(n).on("dragenter",function(e){s||$(n).trigger("file-input:dragenter"),s=e.target,e.preventDefault()}),$(n).on("dragover",function(e){e.preventDefault()}),$(n).on("dragleave",function(e){e.target===s&&($(n).trigger("file-input:dragleave"),s=null),e.preventDefault()})}}(r),!function(e){function s(e){switch(e){case"89504e47":return"image/png";case"47494638":return"image/gif";default:if(e.slice(0,6)==="ffd8ff")return"image/jpeg"}}var t=window.URL||window.webkitURL,n=20,r=100,i=Math.pow(1024,2);e.newlinkController={VALID_DROP_STATE:"image-upload-drop-active",DROP_TARGET_CLASS:"image-upload-drop-target",VALID_FILE_TYPES:/^image\/(png|jpe?g|gif)$/,VALID_URL:/^https?:\/\//,MIN_URL_LENGTH_TO_SUGGEST:15,IS_LOCAL_PREVIEW_SUPPORTED:t&&t.createObjectURL&&t.revokeObjectURL,SUGGEST_TITLE_DEBOUNCE_RATE:500,_suggestedUrl:"",_suggestedTitle:"",_leaseReq:null,_uploader:null,_mimetype:null,_fileType:null,_fileSource:null,isSupported:function(){return e.S3ImageUploader.isSupported()&&window.FileReader&&window.Uint8Array},websocketEvents:{"message:already_created":function(e){$(window).off("beforeunload"),document.getElementById("newlink").reset(),window.location=e.redirect},"message:success":function(e){$(window).off("beforeunload"),document.getElementById("newlink").reset(),window.location=e.redirect},"message:failed":function(){var t=e._("The image upload failed");$("#newlink").find(".status").text(t)}},init:function(){this._debouncedRequestSuggestTitle=_.debounce(this._requestSuggestTitle,this.SUGGEST_TITLE_DEBOUNCE_RATE),this.form=document.getElementById("newlink");if(!this.form)return;this.defaultSubmitHandler=this.form.onsubmit,this.form.onsubmit=this._handleSubmit.bind(this),this.$form=$(this.form),this.$submitButton=this.$form.find("button[name=submit]"),this.$imageField=$("#image-field"),this.$urlField=$("#url-field"),this.$imageThrobber=this.$imageField.find(".new-link-preview-throbber"),this.$urlThrobber=this.$urlField.find(".new-link-preview-throbber"),this.$typeInput=$("#newlink-with-image-upload").find("input[name=kind]"),this.$urlInputDisplayGroup=$("#new-link-url-input"),this.$urlInput=this.$urlInputDisplayGroup.find("input[name=url]"),this.$clearUrlButton=this.$urlInputDisplayGroup.find(".clear-input-button"),this.$fileInputDisplayGroup=$("#new-link-image-input"),this.$fileInput=this.$fileInputDisplayGroup.find("input[type=file]"),this.$imageNameDisplayGroup=$("#new-link-image-name-display"),this.$imageNameDisplayText=this.$imageNameDisplayGroup.find("#image-name"),this.$clearImageButton=this.$imageNameDisplayGroup.find(".clear-input-button"),this.$titleInput=$("#title-field textarea[name=title]"),this.$suggestTitleButton=$("#suggest-title a"),this.$previewLinkDisplayGroup=$("#new-link-preview"),this.$previewLinkTitle=this.$previewLinkDisplayGroup.find(".new-link-preview-title"),this.$previewLinkDomain=this.$previewLinkDisplayGroup.find(".new-link-preview-domain"),this.$previewImageDisplayGroup=$("#new-link-image-preview"),this.$urlInput.on("input",function(e){e.target.value?this._handleUrlInput(e.target.value):this._handleUrlClear()}.bind(this)),this.$clearUrlButton.on("click",function(e){this.$urlInput.val(""),this._handleUrlClear()}.bind(this)),this.$titleInput.on("input",function(e){this._handleTitleChange(e.target.value)}.bind(this)),this.$suggestTitleButton.on("click",function(e){if(!this._suggestedTitle)return;this.$titleInput.val(this._suggestedTitle),this._handleTitleChange(this._suggestedTitle)}.bind(this)),this.isSupported()?(this.$fileInputDisplayGroup.show(),e.actions.bindImageUploadOnInput(this.$fileInput[0],this.form),e.actions.bindImageUploadOnDrop(this.$imageField[0],this.form),e.actions.bindImageUploadOnPaste(window,this.form),this.$fileInputDisplayGroup.addClass(this.DROP_TARGET_CLASS),e.actions.on("file-input",function(e){if(!this._isValidAction(e))return;this._isFileInputAllowed()||e.preventDefault()}.bind(this)),e.actions.on("file-input:success",function(e){this._isValidAction(e)&&(this._fileSource=e.eventDetail,this._validateFileType(e.file).done(function(e){this._renderErrors(null),this._handleFileInput(e)}.bind(this)).fail(function(e){this._renderErrors([e])}.bind(this)))}.bind(this)),this.$clearImageButton.on("click",function(e){this._handleFileClear()}.bind(this)),e.actions.on("file-input:complete",function(e){this._isValidAction(e)&&this.$fileInput.resetInput()}.bind(this)),this.$imageField.on("file-input:dragenter",function(e){this._isFileInputAllowed()&&$(this.$fileInputDisplayGroup).addClass(this.VALID_DROP_STATE)}.bind(this)),this.$imageField.on("file-input:dragleave file-input:drop",function(e){$(this.$fileInputDisplayGroup).removeClass(this.VALID_DROP_STATE)}.bind(this))):this.$fileInputDisplayGroup.empty(),this.$urlInput.val()&&this.$urlInput.trigger("input")},_handleSubmit:function(e){var t=this.form;if(this.$typeInput.val()!=="image")return this.defaultSubmitHandler.call(t,e);if(t.disabled)return!1;try{return simple_post_form(t,"submit",{api_type:"json"},!0,this._handleSubmitStatus.bind(this)),this._setFormDisabled(!0),$(t).find(".error").not(".status").hide(),$(t).find(".status").html(linkstatus(t)).show(),!1}catch(e){return!1}},_handleSubmitStatus:function(t){this.websocket=new e.WebSocket(t.json.data.websocket_url),this.websocket.on(this.websocketEvents),this.websocket.start()},_setFormDisabled:function(e){this.$form.prop("disabled",e),this.$submitButton.prop("disabled",e)},_handleUrlInput:function(e){this._isValidUrl(e)&&this._debouncedRequestSuggestTitle(e),this.$clearUrlButton.show(),this.$imageField.hide(),this.$fileInputDisplayGroup.show(),this.$imageNameDisplayGroup.hide(),this.$imageNameDisplayText.text(""),this.$previewImageDisplayGroup.hide().empty(),this.$typeInput.val("link")},_handleUrlClear:function(){this._suggestedUrl="",this._renderErrors(null),this.$urlThrobber.hide(),this.$imageThrobber.hide(),this.$fileInputDisplayGroup.show(),this.$previewLinkDisplayGroup.hide(),this.$previewLinkTitle.text(""),this.$previewLinkDomain.attr("href","#").text(""),this.$clearUrlButton.hide(),this.$imageField.show()},_handleTitleChange:function(e){this._suggestedTitle&&e!==this._suggestedTitle?this.$suggestTitleButton.show():this.$suggestTitleButton.hide()},_handleFileInput:function(e){this.$fileInputDisplayGroup.hide(),this.$imageNameDisplayGroup.show(),this.$imageNameDisplayText.text(e.name),this.$urlField.hide(),this._setFormDisabled(!0),this._requestS3Lease(e)},_handleFileClear:function(){this._file=null,this._leaseReq=null,this._uploader=null,this._renderErrors(null),this.$urlThrobber.hide(),this.$imageThrobber.hide(),this.$urlInput.val(""),this.$urlField.show(),this.$urlInputDisplayGroup.show(),this.$fileInputDisplayGroup.show(),this.$imageNameDisplayGroup.hide(),this.$imageNameDisplayText.text(""),this.$previewImageDisplayGroup.hide().empty(),this.$typeInput.val("link"),this._setFormDisabled(!1)},_renderErrors:function(t){e.errors.clearAPIErrors(this.form),t&&e.errors.showAPIErrors(this.form,t)},_requestSuggestTitle:function(t){this._suggestedUrl=t,this.$urlThrobber.show(),e.ajax({type:"POST",url:"api/fetch_title",data:{url:t,api_type:"json"}}).done(function(n){if(t!==this._suggestedUrl)return;this._suggestedTitle="",this.$suggestTitleButton.hide(),this.$urlThrobber.hide();var r=e.errors.getAPIErrorsFromResponse(n);if(r){e.errors.showAPIErrors(this.form,r);return}var i=n.json.data?n.json.data.title:"",s=this._getUrlHost(t);i?(this._suggestedTitle=i,this.$previewLinkTitle.text(i),this.$previewLinkDomain.attr("href",s).text(s),this.$previewLinkDisplayGroup.show(),this.$suggestTitleButton.show()):(this.$previewLinkDisplayGroup.hide(),this.$previewLinkTitle.text(""),this.$previewLinkDomain.attr("href","#").text(""))}.bind(this)).fail(function(){if(t!==this._suggestedUrl)return;this._suggestedUrl="",this.$urlThrobber.hide(),this.$previewLinkDisplayGroup.hide(),this.$previewLinkTitle.text(""),this.$previewLinkDomain.attr("href","#").text("")}.bind(this))},_requestS3Lease:function(t){var n=e.S3ImageUploader.request({file:t},this._mimetype);this._leaseReq=n,this.$imageThrobber.show(),n.done(function(e){if(n!==this._leaseReq)return;this._leaseReq=null,this.$imageThrobber.hide(),this._renderErrors(null),this._requestS3Upload(e,t)}.bind(this)).fail(function(e){if(n!==this._leaseReq)return;this._handleFileClear(),this._renderErrors([e])}.bind(this))},_requestS3Upload:function(n,r){this._uploader=n,this._file=r;var i=this._uploader.attributes.key;n.on("request",function(e){if(e!==this._uploader)return;this.$imageThrobber.show();if(this.IS_LOCAL_PREVIEW_SUPPORTED){var n=t.createObjectURL(r);this._makePreviewImage(n,"local-preview-image",function(r){t.revokeObjectURL(n),e===this._uploader&&this.$previewImageDisplayGroup.empty().append(r).show()}.bind(this))}}.bind(this)),n.on("invalid error",function(t,n){if(t!==this._uploader)return;e.analytics.imageUploadEvent(this._fileType,this._file.size,this._fileSource,i,n[0].displayName),this._handleFileClear(),this._renderErrors(n)}.bind(this)),n.on("success",function(t,n){if(t!==this._uploader)return;this.$imageThrobber.hide(),this.$urlInput.val(n),this.$typeInput.val("image"),this._setFormDisabled(!1),this._uploader=null,$(".local-preview-image")[0].className="uploaded-preview-image",e.analytics.imageUploadEvent(this._fileType,this._file.size,this._fileSource,i,!1)}.bind(this)),n.upload()},_makePreviewImage:function(e,t,n){var r=document.createElement("img");r.className=t,r.onload=function(){n(r)},r.src=e},_getUrlHost:function(e){var t=document.createElement("a");return t.href=e,t.host},_isValidAction:function(e){return e.target===this.form||$.contains(this.form,e.target)},_isFileInputAllowed:function(){return this.$imageField.is(":visible")&&!(this._file||this._leaseReq||this._uploader)},_isValidFile:function(e){return e&&(e instanceof File||e instanceof Blob)&&e.size>0},_isValidUrl:function(e){return e&&e.length>this.MIN_URL_LENGTH_TO_SUGGEST&&this.VALID_URL.test(e)},_validateFileType:function(t){var o=$.Deferred(),u=new FileReader,a=t.type.split("/");a.length>1?a=a[1]:a=a[0];if(!this._isValidFile(t)){var f=e.errors.create("BAD_FILE_TYPE",e._("That is not a valid file."),"image-upload");o.reject(f),e.analytics.imageUploadEvent(a,t.size,this._fileSource,null,f.displayName);return}return u.onloadend=function(u){var f=(new Uint8Array(u.target.result)).subarray(0,4),l="";for(var c=0;c<f.length;c++)l+=f[c].toString(16);this._mimetype=s(l),this._mimetype?this._fileType=this._mimetype.split("/")[1]:this._fileType=a;var h=this._mimetype==="image/gif",p;if(!this._mimetype||!this.VALID_FILE_TYPES.test(this._mimetype))p=e.errors.create("BAD_FILE_TYPE",e._("That file type is not allowed"),"image-upload");else if(h&&t.size>r*i){var v=e._("Gif is too big. Maximum gif size is %(maxSize)s.").format({maxSize:r+"mb"});p=e.errors.create("BAD_FILE_SIZE",v),e.analytics.imageUploadEvent(this._fileType,t.size,this._imageSource,null,p.displayName)}else if(!h&&t.size>n*i){var v=e._("Image is too big. Maximum image size is %(maxSize)s.").format({maxSize:n+"mb"});p=e.errors.create("BAD_FILE_SIZE",v),e.analytics.imageUploadEvent(this._fileType,t.size,this._imageSource,null,p.displayName)}p?(o.reject(p),e.analytics.imageUploadEvent(this._fileType,t.size,this._imageSource,null,p.displayName)):o.resolve(t)}.bind(this),u.readAsArrayBuffer(t),o.promise()}},$(function(){e.newlinkController.init()})}(r),r.WebSocket=function(e){this._url=e,this._connectionAttempts=0,this.on({"message:refresh":this._onRefresh},this)},_.extend(r.WebSocket.prototype,Backbone.Events,{_backoffTime:2e3,_maximumRetries:9,_retryJitterAmount:3e3,start:function(){var e="WebSocket"in window;e&&this._connect()},_connect:function(){r.debug("websocket: connecting"),this.trigger("connecting"),this._connectionStart=Date.now(),this._socket=new WebSocket(this._url),this._socket.onopen=_.bind(this._onOpen,this),this._socket.onmessage=_.bind(this._onMessage,this),this._socket.onclose=_.bind(this._onClose,this),this._connectionAttempts+=1},_sendStats:function(e){if(!r.config.stats_domain)return;$.ajax({type:"POST",url:r.config.stats_domain,data:JSON.stringify(e),contentType:"application/json; charset=utf-8"})},_onOpen:function(e){r.debug("websocket: connected"),this.trigger("connected"),this._connectionAttempts=0,this._sendStats({websocketPerformance:{connectionTiming:Date.now()-this._connectionStart}})},_onMessage:function(e){var t=JSON.parse(e.data);r.debug('websocket: received "'+t.type+'" message'),this.trigger("message message:"+t.type,t.payload)},_onRefresh:function(){var e=Math.random()*300*1e3;setTimeout(function(){location.reload()},e)},_onClose:function(e){if(this._connectionAttempts<this._maximumRetries){var t=this._backoffTime*Math.pow(2,this._connectionAttempts),n=Math.random()*this._retryJitterAmount-this._retryJitterAmount/2,i=Math.round(t+n);r.debug("websocket: connection lost ("+e.code+"), reconnecting in "+i+"ms"),r.debug("(can't connect? Make sure you've allowed https access in your browser.)"),this.trigger("reconnecting",i),setTimeout(_.bind(this._connect,this),i)}else r.debug("websocket: maximum retries exceeded. bailing out"),this.trigger("disconnected");this._sendStats({websocketError:{error:1}})},_verifyLocalStorage:function(e){var t="__synced_local_storage_%(keyname)s__".format({keyname:e});try{store.safeSet(t,store.safeGet(t)||"")}catch(n){return!1}return!0},startPerBrowser:function(e,t,n,r){if(!this._verifyLocalStorage(e))return!1;var i=new Date,s=store.safeGet(e)||"";if(!s||i-new Date(s)>15e3)this.on(n),this.start(),store.safeSet(e+"-websocketUrl",t);this._keepTrackOfHeartbeat(e,n,t),window.addEventListener("storage",r)},_writeHeartbeat:function(e,t,n){store.safeSet(e,new Date);var r=setInterval(function(){var i=new Date,s=store.safeGet(e);store.safeGet(e+"-websocketUrl")!==n&&!!s&&i-new Date(s)<5e3&&(this._maximumRetries=0,this._socket.close(),clearInterval(r),this._watchHeartbeat(e,t,n)),store.safeSet(e,new Date)}.bind(this),5e3)},_watchHeartbeat:function(e,t,n){var r=setInterval(function(){var i=new Date,s=store.safeGet(e)||"";if(!s||i-new Date(s)>15e3)this.on(t),this.start(),store.safeSet(e+"-websocketUrl",n),clearInterval(r),this._writeHeartbeat(e,t,n)}.bind(this),15e3)},_keepTrackOfHeartbeat:function(e,t,n){store.safeGet(e+"-websocketUrl")===n?this._writeHeartbeat(e,t,n):this._watchHeartbeat(e,t,n)}});