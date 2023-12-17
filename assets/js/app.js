(function () {
    'use strict';
    
    window.admin = {
        parts: {},
        pages: {}
    };
})();
(function () {
    'use strict';

    $(document).ready(function() {
        admin.parts.main();
        admin.parts.misc();
        admin.parts.mainMenuSidebar();
        admin.parts.bulkActions();
        admin.parts.jqueryValidationCustomMethods();
        admin.parts.passwordVisibilityToggle();
        admin.parts.loadCKEditor();
        admin.parts.downloadCookieHandler();
        admin.parts.select2();
        admin.parts.publicLinksPopup();
        admin.parts.generatePassword();

        // Switch pages
        switch ($("body").data("page-id")) {
            case 'install':
                admin.pages.install();
                break;
            case 'login':
                admin.pages.loginForm();
                admin.pages.loginLdapForm();
                admin.parts.login2faInputs();
                break;
            case 'dashboard':
                admin.pages.dashboard();
                admin.parts.widgetStatistics();
                admin.parts.widgetActionLog();
                admin.parts.widgetNews();
                break;
            case 'categories_list':
                admin.pages.categoriesAdmin();
                break;
            case 'clients_memberships_requests':
                admin.pages.clientsAccountsRequests();
                break;
            case 'clients_accounts_requests':
                admin.pages.clientsAccountsRequests();
                break;
            case 'file_editor':
                admin.pages.fileEditor();
                break;
            case 'client_form':
                admin.pages.clientForm();
                break;
            case 'user_form':
                admin.pages.userForm();
                break;
            case 'group_form':
                admin.pages.groupForm();
                break;
            case 'email_templates':
                admin.pages.emailTemplates();
                break;
            case 'default_template':
            case 'manage_files':
                admin.parts.filePreviewModal();
                break;
            case 'reset_password_enter_email':
                admin.pages.resetPasswordEnterEmail();
                break;
            case 'reset_password_enter_new':
                admin.pages.resetPasswordEnterNew();
                break;
            case 'upload_form':
                admin.pages.uploadForm();
                break;
            case 'import_orphans':
                admin.pages.importOrphans();
                break;
            case 'options':
                admin.pages.options();
                break;
            case 'asset_editor':
                admin.pages.assetEditor();
                break;
            case 'public_files_list':
                admin.parts.filePreviewModal();
                admin.pages.publicFilesList();
                break;
            case 'public_download':
                admin.parts.filePreviewModal();
                break;
            default:
                // do nothing
                break;
        }
    });
})();
function htmlEncode(str)
{
    return String(str).replace(/[^\w. ]/gi, function(c){
        return '&#'+c.charCodeAt(0)+';';
    });
}

// Adapted from https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        if (successful) {
            toastr.success(json_strings.translations.copy_ok)
        } else {
            toastr.error(json_strings.translations.copy_error)    
        }
    } catch (err) {
        toastr.error(json_strings.translations.copy_error)
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }

    navigator.clipboard.writeText(text).then(function() {
        toastr.success(json_strings.translations.copy_ok)
    }, function(err) {
        toastr.error(json_strings.translations.copy_ok)
    });
}

//https://gist.github.com/fnicollier/4258461
function insertAtCaret(areaId,text) {
    var txtarea = document.getElementById(areaId);
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
        "ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") { 
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        strPos = range.text.length;
    }
    else if (br == "ff") strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0,strPos);  
    var back = (txtarea.value).substring(strPos,txtarea.value.length); 
    txtarea.value=front+text+back;
    strPos = strPos + text.length;
    if (br == "ie") { 
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        range.moveStart ('character', strPos);
        range.moveEnd ('character', 0);
        range.select();
    }
    else if (br == "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
}

function urlParamExists(param, value = null)
{
    var urlParams = new URLSearchParams(window.location.search);
    var search = urlParams.get(param);
    
    if(search) {
        return true;
    }

    if (value != null) {
        if(search == value) {
            return true;
        }
    }
    
    return false;
}

function isNumeric(value){
    if (typeof value != "string") {
        return false;
    }

    return !isNaN(value) && !isNaN(parseFloat(value))
}
  
(function () {
    'use strict';

    admin.pages.assetEditor = function () {
        $(document).ready(function()
        {
            const types_allowed = ['js', 'css', 'html'];
            const type = $('#asset_language').val();
            var mode;
            if (types_allowed.includes(type)) {
                switch (type) {
                    case 'css': mode = 'css'; break;
                    case 'js': mode = 'javascript'; break;
                    case 'html': mode = 'htmlmixed'; break;
                }
            }
            // console.log(mode);
            var editor = CodeMirror.fromTextArea(document.getElementById("content"), {
                lineNumbers: true,
                mode: mode,
                //theme: 'neo',
                lineWrapping: true
            });
        });
    };
})();


(function () {
    'use strict';

    admin.pages.categoriesAdmin = function () {

        $(document).ready(function(){
            var validator = $("#process_category").validate({
                rules: {
                    category_name: {
                        required: true,
                    }
                },
                messages: {
                    category_name: {
                        required: json_strings.validation.no_name,
                    }
                },
                errorPlacement: function(error, element) {
                    error.appendTo(element.parent('div'));
                },
            });
        });
    };
})();
(function () {
    'use strict';

    admin.pages.clientForm = function () {

        $(document).ready(function(){
            var form_type = $("#client_form").data('form-type');

            var validator = $("#client_form").validate({
                rules: {
                    name: {
                        required: true
                    },
                    username: {
                        required: true,
                        minlength: json_strings.character_limits.user_min,
                        maxlength: json_strings.character_limits.user_max,
                        alphanumericUsername: true
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    max_file_size: {
                        required: {
                            param: true,
                            depends: function(element) {
                                return form_type != 'new_client_self';
                            }
                        },
                        digits: true
                    },
                    password: {
                        required: {
                            param: true,
                            depends: function(element) {
                                if (form_type == 'new_client' || form_type == 'new_client_self') {
                                    return true;
                                }
                                if (form_type == 'edit_client' || form_type == 'edit_client_self') {
                                    if ($.trim($("#password").val()).length > 0) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                        },
                        minlength: json_strings.character_limits.password_min,
                        maxlength: json_strings.character_limits.password_max,
                        passwordValidCharacters: true
                    }
                },
                messages: {
                    name: {
                        required: json_strings.validation.no_name
                    },
                    username: {
                        required: json_strings.validation.no_user,
                        minlength: json_strings.validation.length_user,
                        maxlength: json_strings.validation.length_user,
                        alphanumericUsername: json_strings.validation.alpha_user
                    },
                    email: {
                        required: json_strings.validation.no_email,
                        email: json_strings.validation.invalid_email
                    },
                    max_file_size: {
                        digits: json_strings.validation.file_size
                    },
                    password: {
                        required: json_strings.validation.no_pass,
                        minlength: json_strings.validation.length_pass,
                        maxlength: json_strings.validation.length_pass,
                        passwordValidCharacters: json_strings.validation.alpha_pass
                    }
                },
                errorPlacement: function(error, element) {
                    error.appendTo(element.parent('div'));
                }
            });
        });
    };
})();
(function () {
    'use strict';

    admin.pages.clientsAccountsRequests = function () {

        $(document).ready(function(){
            $('.change_all').click(function(e) {
                e.preventDefault();
                var target = $(this).data('target');
                var check = $(this).data('check');
                $("input[data-client='"+target+"']").prop("checked",check).change();
                check_client(target);
            });
            
            $('.account_action').on("change", function() {
                if ( $(this).prop('checked') == false )  {
                    var target = $(this).data('client');
                    $(".membership_action[data-client='"+target+"']").prop("checked",false).change();
                }
            });
    
            $('.checkbox_toggle').change(function() {
                var target = $(this).data('client');
                check_client(target);
            });
    
            function check_client(client_id) {
                $("input[data-clientid='"+client_id+"']").prop("checked",true);
            }
        });
    };
})();
(function () {
    'use strict';
    
    admin.pages.dashboard = function () {
        
        $(document).ready(function(){
            // Nothing here yet
        });
    };
})();
(function () {
    'use strict';

    admin.pages.emailTemplates = function () {

        $(document).ready(function(){
            $(document).on('click', '.load_default', function(e) {
                e.preventDefault();

                var file = jQuery(this).data('file');
                var textarea = document.getElementById(jQuery(this).data('textarea'));
                var accept = confirm(json_strings.translations.email_templates.confirm_replace);
                
                if ( accept ) {
                    $.ajax({
                        url: "emails/"+file,
                        cache: false,
                        success: function (data){
                            textarea.value = data;
                        },
                        error: function() {
                            alert(json_strings.translations.email_templates.loading_error);
                        }
                    });
                }
            });
    
            $('.preview').click(function(e) {
                e.preventDefault();
                var type = jQuery(this).data('preview');
                var url = json_strings.uri.base+ 'email-preview.php?t=' + type;
                window.open(url, "previewWindow", "width=800,height=600,scrollbars=yes");
            });
        });

        $('.insert_tag').on('click', function(e) {
            var target = jQuery(this).data('target');
            insertAtCaret(target, $(this).data('tag'));
        });

        // Check if each tag is used or not
        var tags_dt = document.querySelectorAll('#email_available_tags dt button');
        var tags = [];
        Array.prototype.forEach.call(tags_dt, function(tag) {
            tags.push(tag.dataset.tag);
        });

        var textareas = document.querySelectorAll('#form_email_template textarea');

        const check_tags_usage = setInterval(() => {
            tags.forEach(tag => {
                checkTagsUsage(tag);
            });
        }, 1000);

        function checkTagsUsage(tag)
        {
            textareas.forEach(element => {
                const el = document.querySelector('button[data-tag="'+tag+'"]');
                if (!element.value.includes(tag)) {
                    el.classList.add('btn-warning');
                    el.classList.remove('btn-pslight');
                } else {
                    el.classList.add('btn-pslight');
                    el.classList.remove('btn-warning');
                }
            });
        }
    };
})();
(function () {
    'use strict';

    admin.pages.fileEditor = function () {

        $(document).ready(function(){
            // Datepicker
            if ( $.isFunction($.fn.datepicker) ) {
                $('.date-container .date-field').datepicker({
                    format : 'dd-mm-yyyy',
                    autoclose : true,
                    todayHighlight : true
                });
            }

            // Validation
            var validator = $("#files").validate({
                errorPlacement: function(error, element) {
                    error.appendTo(element.parent('div'));
                }
            });

            var file = $('input[name^="file"]');

            file.filter('input[name$="[name]"]').each(function() {
                $(this).rules("add", {
                    required: true,
                    messages: {
                        required: json_strings.validation.no_name
                    }
                });
            });

            // Copy settings to other files
            function copySettingsToCheckboxes(el, to, question)
            {
                if ( confirm( question ) ) {
                    $(to).each(function(i, obj) {
                        var from_element = document.getElementById($(el).data('copy-from'));
                        $(this).prop('checked', from_element.checked);
                    });
                }
            }

            $('.copy-expiration-settings').on('click', function() {
                copySettingsToCheckboxes($(this), '.checkbox_setting_expires', json_strings.translations.upload_form.copy_expiration);
                // Copy date
                var element = $('#'+$(this).data('copy-date-from'));
                var date = element.val();
                $('.date-field').each(function(i, obj) {
                    console.log(date);
                    $('.date-field').datepicker('update', date);
                });
            });

            $('.copy-public-settings').on('click', function() {
                copySettingsToCheckboxes($(this), '.checkbox_setting_public', json_strings.translations.upload_form.copy_public);
            });

            $('.copy-hidden-settings').on('click', function() {
                copySettingsToCheckboxes($(this), '.checkbox_setting_hidden', json_strings.translations.upload_form.copy_hidden);
            });

            // Collapse - expand single item
            $('.toggle_file_editor').on('click', function(e) {
                let wrapper = $(this).parents('.file_editor_wrapper');
                wrapper.toggleClass('collapsed');
            });

            // Collapse all
            document.getElementById('files_collapse_all').addEventListener('click', function(e) {
                let wrappers = document.querySelectorAll('.file_editor_wrapper');
                wrappers.forEach(wrapper => {
                    wrapper.classList.add('collapsed');
                });
                    
            })

            // Expand all
            document.getElementById('files_expand_all').addEventListener('click', function(e) {
                let wrappers = document.querySelectorAll('.file_editor_wrapper');
                wrappers.forEach(wrapper => {
                    wrapper.classList.remove('collapsed');
                });
                    
            })
        });
    };
})();
(function () {
    'use strict';

    admin.pages.groupForm = function () {

        $(document).ready(function(){
            var validator = $("#group_form").validate({
                rules: {
                    name: {
                        required: true
                    },
                },
                messages: {
                    name: {
                        required: json_strings.validation.no_name
                    },
                },
                errorPlacement: function(error, element) {
                    error.appendTo(element.parent('div'));
                }
            });
        });
    };
})();
(function () {
    'use strict';

    admin.pages.importOrphans = function () {

        $(document).ready(function(){
            $("#import_orphans").submit(function() {
				var checks = $("td>input:checkbox").serializeArray(); 
				
				if (checks.length == 0) { 
					alert(json_strings.translations.select_one_or_more);
					return false; 
				} 
			});
			
			/**
			 * Only select the current file when clicking an "edit" button
			 */
			$('.btn-edit-file').click(function(e) {
				$('#select_all').prop('checked', false);
				$('td .select_file_checkbox').prop('checked', false);
				$(this).parents('tr').find('td .select_file_checkbox').prop('checked', true);
				$("#import_orphans").submit();
			});
        });
    };
})();
(function () {
    'use strict';

    admin.pages.install = function () {

        $(document).ready(function(){
            var validator = $("#install_form").validate({
                rules: {
                    install_title: {
                        required: true,
                    },
                    base_uri: {
                        required: true
                        // url: true // Does not work on localhost
                    },
                    admin_name: {
                        required: true,
                    },
                    admin_email: {
                        required: true,
                        email: true
                    },
                    admin_username: {
                        required: true,
                        minlength: json_strings.character_limits.user_min,
                        maxlength: json_strings.character_limits.user_max,
                        alphanumericUsername: true
                    },
                    admin_pass: {
                        required: true,
                        minlength: json_strings.character_limits.password_min,
                        maxlength: json_strings.character_limits.password_max,
                        passwordValidCharacters: true
                    },
                },
                messages: {
                    category_name: {
                        required: json_strings.validation.no_name,
                    }
                },
                errorPlacement: function(error, element) {
                    error.appendTo(element.parent('div'));
                },
            });
        });
    };
})();
(function () {
    'use strict';

    admin.pages.loginForm = function () {

        $(document).ready(function(){
            // let data_changed = false;
            // $('body').on('input', '#username, #password', function(e) {
            //     data_changed = true;
            // });

            // $('body').on('change', '#language', function (e) {
            //     if (data_changed == false) {
            //         let change_locale_uri = json_strings.uri.base + 'process.php?do=change_language&language=' + $(this).val();
            //         window.location.replace(change_locale_uri);;
            //     }
            // });

            var initial = $('.seconds_countdown').text();
            if (initial) {
                $('#btn_submit').attr('disabled', 'disabled');
            }
            var downloadTimer = setInterval(function(){
                if (initial <= 0) {
                    clearInterval(downloadTimer);
                    $('#btn_submit').removeAttr('disabled');
                    $('#message_countdown').slideUp();
                }
                $('.seconds_countdown').text(initial);
                initial -= 1;
            }, 1000);

            var validator = $("#login_form").validate({
                rules: {
                    username: {
                        required: true,
                    },
                    password: {
                        required: true,
                    },
                },
                messages: {
                    username: {
                        required: json_strings.validation.no_user,
                    },
                    password: {
                        required: json_strings.validation.no_pass,
                    }
                },
                errorPlacement: function(error, element) {
                    error.appendTo(element.parent('div'));
                },
                submitHandler: function(form) {
                    form.submit();

                    var button_loading_text = json_strings.login.logging_in;
                    $('#btn_submit').html('<i class="fa fa-cog fa-spin fa-fw"></i><span class="sr-only"></span> '+button_loading_text+'...').attr('disabled', 'disabled');
                    /*
                    
                    var button_text = json_strings.login.button_text;
                    var button_redirecting_text = json_strings.login.redirecting;
                    var url = $(form).attr('action');
                    $('.ajax_response').html('').removeClass('alert alert-danger alert-success').slideUp();
                    

                    $.ajax({
                        cache: false,
                        method: 'POST',
                        url: url,
                        data: $(form).serialize(),
                    }).done( function(data) {
                        var obj = JSON.parse(data);
                        if ( obj.status == 'success' ) {
                            $('#submit').html('<i class="fa fa-check"></i><span class="sr-only"></span> '+button_redirecting_text+'...');
                            $('#submit').removeClass('btn-primary').addClass('btn-success');
                            setTimeout('window.location.href = "'+obj.location+'"', 1000);
                        } else {
                            $('.ajax_response').addClass('alert alert-danger').slideDown().html(obj.message);
                            $('#submit').html(button_text).removeAttr('disabled');
                        }
                    }).fail( function(data) {
                        $('.ajax_response').addClass('alert alert-danger').slideDown().html('Uncaught error');
                        $('#submit').html(button_text).removeAttr('disabled');
                    }).always( function() {
                    });

                    return false;
                    */
                }
            });
        });
    };
})();
(function () {
    'use strict';

    admin.pages.loginLdapForm = function () {

        $(document).ready(function(){
            var validator = $("#login_ldap_form").validate({
                rules: {
                    ldap_email: {
                        required: true,
                    },
                    ldap_password: {
                        required: true,
                    },
                },
                messages: {
                    ldap_email: {
                        required: json_strings.validation.no_email,
                    },
                    ldap_password: {
                        required: json_strings.validation.no_pass,
                    }
                },
                errorPlacement: function(error, element) {
                    error.appendTo(element.parent('div'));
                },
                submitHandler: function(form) {
                    var button_text = json_strings.login.button_text;
                    var button_loading_text = json_strings.login.logging_in;
                    var button_redirecting_text = json_strings.login.redirecting;

                    var url = $(form).attr('action');
                    $('.ajax_response').html('').removeClass('alert-danger alert-success').slideUp();
                    $('#ldap_submit').html('<i class="fa fa-cog fa-spin fa-fw"></i><span class="sr-only"></span> '+button_loading_text+'...');
                    $.ajax({
                        cache: false,
                        type: "post",
                        url: url,
                        data: $(form).serialize(),
                        success: function(response)
                        {
                            var json = jQuery.parseJSON(response);
                            if ( json.status == 'success' ) {
                                $('#ldap_submit').html('<i class="fa fa-check"></i><span class="sr-only"></span> '+button_redirecting_text+'...');
                                $('#ldap_submit').removeClass('btn-primary').addClass('btn-success');
                                setTimeout('window.location.href = "'+json.location+'"', 1000);
                            }
                            else {
                                $('.ajax_response').addClass('alert-danger').slideDown().html(json.message);
                                $('#ldap_submit').html("'"+button_text+"'");
                            }
                        }
                    });

                    return false;
                }
            });
        });
    };
})();
(function () {
    'use strict';

    admin.pages.options = function () {
        var tagifyContainer = document.getElementById('allowed_file_types');
        var tagify = new Tagify (tagifyContainer);
        //tagifyContainer.addEventListener('change', tagifyOnChange)

        function tagifyOnChange(e){
            console.log(e.target.value)
        }

        $(document).ready(function(){
            var validator = $("#options").validate({
                errorPlacement: function(error, element) {
                    error.appendTo(element.parent('div'));
                },
            });

            $('#download_method').on('change', function(e) {
                var method = $(this).find('option:selected').val();
                $('.method_note').hide();
                $('.method_note[data-method="'+method+'"]').show();
            });

            $('#download_method').trigger('change');
        });
    };
})();
(function () {
    'use strict';

    admin.pages.publicFilesList = function () {

        $(document).ready(function(){
            $('select[name="group"]').on('change', function(e) {
                var token = $(this).find(':selected').data('token');
                $('input[name="token"]').val(token);
            });
        });
    };
})();
(function () {
    'use strict';

    admin.pages.resetPasswordEnterEmail = function () {

        $(document).ready(function(){
            var validator = $("#reset_password_enter_email").validate({
                rules: {
                    email: {
                        required: true,
                        email: true,
                    },
                },
                messages: {
                    email: {
                        required: json_strings.validation.no_email,
                        email: json_strings.validation.invalid_email
                    },
                },
                errorPlacement: function(error, element) {
                    error.appendTo(element.parent('div'));
                }
            });
        });
    };
})();
(function () {
    'use strict';

    admin.pages.resetPasswordEnterNew = function () {

        $(document).ready(function(){
            var validator = $("#reset_password_enter_new").validate({
                rules: {
                    password: {
                        required: true,
                        minlength: json_strings.character_limits.password_min,
                        maxlength: json_strings.character_limits.password_max,
                        passwordValidCharacters: true
                    }
                },
                messages: {
                    password: {
                        required: json_strings.validation.no_pass,
                        minlength: json_strings.validation.length_pass,
                        maxlength: json_strings.validation.length_pass,
                        passwordValidCharacters: json_strings.validation.alpha_pass
                    }
                },
                errorPlacement: function(error, element) {
                    error.appendTo(element.parent('div'));
                }
            });
        });
    };
})();
(function () {
    'use strict';

    admin.pages.uploadForm = function () {

        $(document).ready(function(){
            var file_ids = [];
            var errors = 0;
            var successful = 0;

            // Send a keep alive action every 1 minute
            setInterval(function(){
                var timestamp = new Date().getTime()
                $.ajax({
                    type:	'GET',
                    cache:	false,
                    url:	'includes/ajax-keep-alive.php',
                    data:	'timestamp='+timestamp,
                    success: function(result) {
                        var dummy = result;
                    }
                });
            },1000*60);

            var uploader = $('#uploader').pluploadQueue();

            $('#upload_form').on('submit', function(e) {
                if (uploader.files.length > 0) {
                    uploader.bind('StateChanged', function() {
                        if (uploader.files.length === (uploader.total.uploaded + uploader.total.failed)) {
                            var action = $('#upload_form').attr('action') + '?ids=' + file_ids.toString() + '&type=new';
                            $('#upload_form').attr('action', action);
                            if (successful > 0) {
                                if (errors == 0) {
                                    window.location = action;
                                } else {
                                    $(`
                                        <div class="alert alert-info">`+json_strings.translations.upload_form.some_files_had_errors+`</div>
                                        <a class="btn btn-wide btn-primary" href="`+action+`">`+json_strings.translations.upload_form.continue_to_editor+`</a>
                                    `).insertBefore( "#upload_form" );
                                }
                                return;
                            }
                            // $('#upload_form')[0].submit();
                        }
                    });

                    uploader.start();

                    $("#btn-submit").hide();
                    $(".message_uploading").fadeIn();

                    uploader.bind('Error', function(uploader, error) {
                        var obj = JSON.parse(error.response);
                        $(
                            `<div class="alert alert-danger">`+obj.error.filename+`: `+obj.error.message+`</div>`
                        ).insertBefore( "#upload_form" );
                        //console.log(obj);
                    });
        
                    uploader.bind('FileUploaded', function (uploader, file, info) {
                        var obj = JSON.parse(info.response);
                        file_ids.push(obj.info.id);
                        successful++;
                    });

                    return false;
                } else {
                    alert(json_strings.translations.upload_form.no_files);
                }

                return false;
            });

            window.onbeforeunload = function (e) {
                var e = e || window.event;

                console.log('state? ' + uploader.state);

                // if uploading
                if(uploader.state === 2) {
                    //IE & Firefox
                    if (e) {
                        e.returnValue = json_strings.translations.upload_form.leave_confirm;
                    }

                    // For Safari
                    return json_strings.translations.upload_form.leave_confirm;
                }

            };

        });
    };
})();
(function () {
    'use strict';

    admin.pages.userForm = function () {

        $(document).ready(function(){
            // Display or not the limit accounts selector
            $('#level').on('change', function(e) {
                var el = document.getElementById('limit_upload_to_container');
                if (typeof(el) != 'undefined' && el != null) {
                    if ($(this).val() == '7') {
                        $('#limit_upload_to_container').slideDown();
                    } else {
                        $('#limit_upload_to_container').slideUp();
                    }
                }
            });

            var form_type = $("#user_form").data('form-type');

            var validator = $("#user_form").validate({
                rules: {
                    name: {
                        required: true
                    },
                    username: {
                        required: true,
                        minlength: json_strings.character_limits.user_min,
                        maxlength: json_strings.character_limits.user_max,
                        alphanumericUsername: true
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    level: {
                        required: true
                    },
                    max_file_size: {
                        required: true,
                        digits: true
                    },
                    password: {
                        required: {
                            param: true,
                            depends: function(element) {
                                if (form_type == 'new_user') {
                                    return true;
                                }
                                if (form_type == 'edit_user' || form_type == 'edit_user_self') {
                                    if ($.trim($("#password").val()).length > 0) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                        },
                        minlength: json_strings.character_limits.password_min,
                        maxlength: json_strings.character_limits.password_max,
                        passwordValidCharacters: true
                    }
                },
                messages: {
                    name: {
                        required: json_strings.validation.no_name
                    },
                    username: {
                        required: json_strings.validation.no_user,
                        minlength: json_strings.validation.length_user,
                        maxlength: json_strings.validation.length_user,
                        alphanumericUsername: json_strings.validation.alpha_user
                    },
                    email: {
                        required: json_strings.validation.no_email,
                        email: json_strings.validation.invalid_email
                    },
                    level: {
                        required: json_strings.validation.no_role
                    },
                    max_file_size: {
                        digits: json_strings.validation.file_size
                    },
                    password: {
                        required: json_strings.validation.no_pass,
                        minlength: json_strings.validation.length_pass,
                        maxlength: json_strings.validation.length_pass,
                        passwordValidCharacters: json_strings.validation.alpha_pass
                    }
                },
                errorPlacement: function(error, element) {
                    error.appendTo(element.parent('div'));
                }
            });
        });
    };
})();
/**
 * Apply bulk actions
 */
(function () {
    'use strict';

    admin.parts.bulkActions = function () {

        $(document).ready(function(e) {
            $(".batch_actions").on('submit', function(e) {
                var checks = $("td>input:checkbox").serializeArray();
                var action = $('#action').val();
                if (action != 'none') {
                        // Generic actions
                        if (action == 'delete') {
                            if (checks.length == 0) {
                                alert(json_strings.translations.select_one_or_more);
                                return false;
                            }
                            else {
                                var _formatted = sprintf(json_strings.translations.confirm_delete, checks.length);
                                if (!confirm(_formatted)) {
                                    e.preventDefault();
                                }
                            }
                        }

                        // Activities log actions
                        if (action == 'log_clear') {
                            var msg = json_strings.translations.confirm_delete_log;
                            if (!confirm(msg)) {
                                e.preventDefault();
                            }
                        }

                        if (action == 'log_download') {
                            e.preventDefault();

                            let modal_content = `<p class="loading-icon">
                                <img src="`+json_strings.uri.assets_img+`/loading.svg" alt="Loading" /></p>
                                <p class="lead">`+json_strings.translations.download_wait+`</p>
                            `;

                            Cookies.set('log_download_started', 0, { expires: 100 });
                            setTimeout(check_log_download_cookie, 1000);

                            Swal.fire({
                                title: '',
                                html: modal_content,
                                showCloseButton: false,
                                showCancelButton: false,
                                showConfirmButton: false,
                                showClass: {
                                    popup: 'animate__animated animated__fast animate__fadeInUp'
                                },
                                hideClass: {
                                    popup: 'animate__animated animated__fast animate__fadeOutDown'
                                },
                                didOpen: function () {
                                    var url = json_strings.uri.base+'includes/actions.log.export.php?format=csv';
                                    let iframe = document.createElement('iframe');
                                    let swalcontainer = document.getElementById('swal2-html-container')
                                    swalcontainer.appendChild(iframe);
                                    iframe.setAttribute('src', url);
                                }
                            }).then((result) => {
                            });
                        }

                        if (action == 'cron_log_download') {
                            e.preventDefault();

                            let modal_content = `<p class="loading-icon">
                                <img src="`+json_strings.uri.assets_img+`/loading.svg" alt="Loading" /></p>
                                <p class="lead">`+json_strings.translations.download_wait+`</p>
                            `;

                            Cookies.set('log_download_started', 0, { expires: 100 });
                            setTimeout(check_log_download_cookie, 1000);

                            Swal.fire({
                                title: '',
                                html: modal_content,
                                showCloseButton: false,
                                showCancelButton: false,
                                showConfirmButton: false,
                                showClass: {
                                    popup: 'animate__animated animated__fast animate__fadeInUp'
                                },
                                hideClass: {
                                    popup: 'animate__animated animated__fast animate__fadeOutDown'
                                },
                                didOpen: function () {
                                    var url = json_strings.uri.base+'includes/cron.log.export.php?format=csv';
                                    let iframe = document.createElement('iframe');
                                    let swalcontainer = document.getElementById('swal2-html-container')
                                    swalcontainer.appendChild(iframe);
                                    iframe.setAttribute('src', url);
                                }
                            }).then((result) => {
                            });
                        }

                        // Manage files actions
                        if (action == 'unassign') {
                            var _formatted = sprintf(json_strings.translations.confirm_unassign, checks.length);
                            if (!confirm(_formatted)) {
                                e.preventDefault();
                            }
                        }

                        // Download multiple files as zip
                        if (action == 'zip') {
                            e.preventDefault();
                            var checkboxes = $("td>input:checkbox:checked").serializeArray();
                            if (checkboxes.length > 0) {
                                let modal_content = `<p class="loading-icon"><img src="`+json_strings.uri.assets_img+`/loading.svg" alt="Loading" /></p>
                                    <p class="lead">`+json_strings.translations.download_wait+`</p>
                                    <p class="">`+json_strings.translations.download_long_wait+`</p>
                                `;

                                Cookies.set('download_started', 0, { expires: 100 });
                                setTimeout(check_download_cookie, 1000);

                                Swal.fire({
                                    title: '',
                                    html: modal_content,
                                    showCloseButton: false,
                                    showCancelButton: false,
                                    showConfirmButton: false,
                                    showClass: {
                                        popup: 'animate__animated animated__fast animate__fadeInUp'
                                    },
                                    hideClass: {
                                        popup: 'animate__animated animated__fast animate__fadeOutDown'
                                    },
                                    didOpen: function () {
                                        $.ajax({
                                            method: 'GET',
                                            url: json_strings.uri.base + 'process.php',
                                            data: { do:"return_files_ids", files:checkboxes }
                                        }).done( function(rsp) {
                                            var url = json_strings.uri.base + 'process.php?do=download_zip&files=' + rsp;
                                            let iframe = document.createElement('iframe');
                                            let swalcontainer = document.getElementById('swal2-html-container')
                                            swalcontainer.appendChild(iframe);
                                            iframe.setAttribute('src', url);
                                        });
                                    }
                                }).then((result) => {
                                });
                            }
                        }
                }
                else {
                    return false;
                }
            });
        });
    };
})();
(function () {
    'use strict';

    admin.parts.downloadCookieHandler = function () {
        $(document).ready(function() {
            /**
             * CLOSE THE ZIP DOWNLOAD MODAL
             * Solution to close the modal. Suggested by remez, based on
             * https://stackoverflow.com/questions/29532788/how-to-display-a-loading-animation-while-file-is-generated-for-download
             */
            var downloadTimeout;
            window.check_download_cookie = function() {
                if (Cookies.get("download_started") == 1) {
                    Cookies.set("download_started", "false", { expires: 100 });
                    Swal.close();
                } else {
                    downloadTimeout = setTimeout(check_download_cookie, 1000);
                }
            };

            // Close the log CSV download modal
            var logdownloadTimeout;
            window.check_log_download_cookie = function() {
                if (Cookies.get("log_download_started") == 1) {
                    Cookies.set("log_download_started", "false", { expires: 100 });
                    Swal.close();
                } else {
                    logdownloadTimeout = setTimeout(check_log_download_cookie, 1000);
                }
            };
        });
    }
})();
(function () {
    'use strict';

    admin.parts.filePreviewModal = function () {

        $(document).ready(function(e) {
            // Append modal
            var modal_layout = `<div id="preview_modal" class="modal fade" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">×</button>
                        </div>
                        <div class="modal-body">
                        </div>
                        <div class="modal-footer">
                        </div>
                    </div>
                </div>
            </div>`;
            $('body').append(modal_layout);

            // Button trigger
            $('.get-preview').on('click', function(e) {
                e.preventDefault();
                var url = $(this).data("url"); 
                var content = '';

                $.ajax({
                    method: "GET",
                    url: url,
                    cache: false,
                }).done(function(response) {
                    var obj = JSON.parse(response);
                    switch (obj.type) {
                        case 'video':
                            content = `
                                <div class="embed-responsive embed-responsive-16by9">
                                    <video controls>
                                        <source src="`+obj.file_url+`" format="`+obj.mime_type+`">
                                    </video>
                                </div>`;
                            break;
                        case 'audio':
                            content = `
                                <audio controls>
                                    <source src="`+obj.file_url+`" format="`+obj.mime_type+`">
                                </audio>`;
                            break;
                        case 'pdf':
                            content = `
                                <div class="embed-responsive embed-responsive-16by9">
                                    <iframe src="`+obj.file_url+`"></iframe>
                                </div>
                            `;
                            break;
                        case 'image':
                            content = `<img src="`+obj.file_url+`" class="img-responsive">`
                            break;
                        }
                    $('.modal-header h5').html(obj.name);
                    $('.modal-body').html(content);
                    // show modal
                    $('#preview_modal').modal('show');
                }).fail(function(response) {
                    alert(json_strings.translations.preview_failed);
                }).always(function() {
                });    
            });

            // Remove content when closing modal
            $('#preview_modal').on('hidden.bs.modal', function (e) {
                $('.modal-body').html('');
            })
        });
    };
})();
(function () {
    'use strict';

    admin.parts.generatePassword = function () {
        $(document).ready(function () {
            var hdl = new Jen(true);
            hdl.hardening(true);

            $('.btn_generate_password').click(function(e) {
                var target = $(this).parents('.form-group').find('.attach_password_toggler');
                var min_chars = $(this).data('min');
                var max_chars = $(this).data('max');
                $(target).val( hdl.password( min_chars, max_chars ) );
            });
        });
    };
})();
(function () {
    'use strict';

    admin.parts.jqueryValidationCustomMethods = function () {

        $(document).ready(function(){
            jQuery.validator.addMethod("alphanumericUsername", function(value, element) {
                return this.optional(element) || /^[\w.]+$/i.test(value);
            }, json_strings.validation.alpha_user);

            jQuery.validator.addMethod("passwordValidCharacters", function(value, element) {
                return this.optional(element) || /^[0-9a-zA-Z`!"?$%\^&*()_\-+={\[}\]:;@~#|<,>.'\/\\]+$/.test(value);
            }, json_strings.validation.alpha_user);
        });
    };
})();
(function () {
    'use strict';

    admin.parts.loadCKEditor = function () {

        $(document).ready(function() {
            if (document.querySelector('textarea.ckeditor') !== null) {
                // CKEditor
                ClassicEditor
                    .create( document.querySelector( '.ckeditor' ), {
                        removePlugins: [ 'Heading', 'Link' ],
                        toolbar: [ 'bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote' ]
                    })
                    .then( editor => {
                        window.editor = editor;
                    } )
                    .catch( error => {
                        console.error( 'There was a problem initializing the editor.', error );
                    } );
            }
        });
    }
})();
(function () {
    'use strict';

    admin.parts.login2faInputs = function () {

        let request_button = document.getElementById('request_new_2fa_code');
        if (typeof(request_button) != 'undefined' && request_button != null) {
            request_button.addEventListener('click', function (event) {
                // request new
                const token = document.getElementsByName('token')[0].value;
                console.log(token);
            })

            // Countdown and enable button            
            const shouldEnableButton = setInterval(() => {
                const wait_until = request_button.dataset.time;
                var now = new Date();
                var dateUntil = new Date(wait_until);
                var diff = Math.ceil((dateUntil - now) / 1000);
                request_button.innerText = request_button.dataset.textWait.replace('{seconds}', diff);
                if (diff < 0) {
                    request_button.innerText = request_button.dataset.text;
                    request_button.removeAttribute('disabled');
                    clearInterval(shouldEnableButton);
                }
            }, 1000);
        }

        // Adapted from Jinul's answer at
        // https://stackoverflow.com/questions/41698357/how-to-partition-input-field-to-appear-as-separate-input-fields-on-screen
        function OTPInput() {
            const otp_input_1 = document.querySelector('#otp_inputs #n1');
            if (typeof(otp_input_1) != 'undefined' && otp_input_1 != null){
                otp_input_1.onpaste = pasteOTP;
            }

            const inputs = document.querySelectorAll('#otp_inputs > *[id]');
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].addEventListener('input', function (event) {
                    handleOTPNumericInput(event, this);
                });

                inputs[i].addEventListener('keyup', function (event) {
                    handleOTPNumericInput(event, this);
                });

                inputs[i].addEventListener('paste', function (event) {
                    handleOTPNumericInput(event, this);
                });
            }
        }
        OTPInput();

        function handleOTPNumericInput(event, el) {
            if (event.key !== 'undefined' && event.key != 'Backspace') {
                if (!isNumeric(event.target.value)) {
                    el.value = '';
                    el.focus();
                    return;
                }
            }
            if (!event.target.value || event.target.value == '') {
                if (event.target.previousSibling.previousSibling) {
                    event.target.previousSibling.previousSibling.focus();
                }
            } else {
                if (event.target.nextSibling.nextSibling) {
                    event.target.nextSibling.nextSibling.focus();
                }
            }
        }

        function pasteOTP(event) {
            event.preventDefault();
            let elm = event.target;
            let pasteVal = event.clipboardData.getData('text').split("");
            if (pasteVal.length > 0) {
                while (elm) {
                    elm.value = pasteVal.shift();
                    elm = elm.nextSibling.nextSibling;
                }
                const last = document.getElementById('n6').focus();
            }
        }
    }
})();
(function () {
    'use strict';

    admin.parts.main = function () {

        $(document).ready(function() {
        });
    };
})();
(function () {
    'use strict';

    admin.parts.mainMenuSidebar = function () {

        $(document).ready(function() {
            window.adjust_main_menu = function() {
                var window_width = jQuery(window).width();
                if ( window_width < 769 ) {
                    $('.main_menu .active .dropdown_content').hide();
                    $('.main_menu li').removeClass('active');
            
                    if ( !$('body').hasClass('menu_contracted') ) {
                        $('body').addClass('menu_contracted');
                    }
                }
            }

            adjust_main_menu();

            $('.main_menu > li.has_dropdown .nav_top_level').click(function(e) {
                e.preventDefault();

                var parent = $(this).parents('.has_dropdown');
                if ( $(parent).hasClass('active') ) {
                    $(parent).removeClass('active');
                    $(parent).find('.dropdown_content').stop().slideUp();
                }
                else {
                    if ( $('body').hasClass('menu_contracted') ) {
                        $('.main_menu li').removeClass('active');
                        $('.main_menu').find('.dropdown_content').stop().slideUp(100);
                    }
                    $(parent).addClass('active');
                    $(parent).find('.dropdown_content').stop().slideDown();
                }
            });

            $('.toggle_main_menu').click(function(e) {
                e.preventDefault();

                var window_width = jQuery(window).width();
                if ( window_width > 768 ) {
                    $('body').toggleClass('menu_contracted');
                    if ( $('body').hasClass('menu_contracted') ) {
                        Cookies.set("menu_contracted", 'true', { expires: 365 } );
                        $('.main_menu li').removeClass('active');
                        $('.main_menu').find('.dropdown_content').stop().hide();
                    }
                    else {
                        Cookies.set("menu_contracted", 'false', { expires: 365 } );
                        $('.current_nav').addClass('active');
                        $('.current_nav').find('.dropdown_content').stop().show();
                    }
                }
                else {
                    $('body').toggleClass('menu_hidden');
                    $('.main_menu li').removeClass('active');

                    if ( $('body').hasClass('menu_hidden') ) {
                        //Cookies.set("menu_hidden", 'true', { expires: 365 } );
                        $('.main_menu').find('.dropdown_content').stop().hide();
                    }
                    else {
                        //Cookies.set("menu_hidden", 'false', { expires: 365 } );
                    }
                }
            });
        });

        jQuery(window).resize(function($) {
            adjust_main_menu();
        });
    }
})();
(function () {
    'use strict';

    admin.parts.misc = function () {

        $(document).ready(function() {
            // Focus the first input on the page. Generally, it's the search box
            $('input:first').focus();

            // Generic confirm alert
            $('.confirm_generic').on('click', function(e) {
                if (!confirm(json_strings.translations.confirm_generic)) {
                    e.preventDefault();
                }
            });
    
            // Dismiss messages
            $('.message .close').on('click', function () {
                $(this).closest('.message').transition('fade');
            });

            // Common for all tables
            $("#select_all").click(function(){
                var status = $(this).prop("checked");
                /** Uncheck all first in case you used pagination */
                $("tr td input[type=checkbox].batch_checkbox").prop("checked",false);
                $("tr:visible td input[type=checkbox].batch_checkbox").prop("checked",status);
            });

            // Loose focus after clicking buttons
            $('button').on('click', function() {
                $(this).blur();
            });

            $('.copy_text').on('click', function(e) {
                let target_id = $(this).data('target');
                let target = document.getElementById(target_id);
                var element_type = target.tagName.toLowerCase();
                switch (element_type) {
                    case 'input':
                        copyTextToClipboard(target.value);
                    break;
                    default:
                        copyTextToClipboard(target.innerHTML);
                    break;
                }
            });
        });
    };
})();
(function () {
    'use strict';

    admin.parts.passwordVisibilityToggle = function () {
        let password_inputs = document.querySelectorAll('.attach_password_toggler')
        password_inputs.forEach(element => {
            var id;
            if (element.hasAttribute('id')) {
                id = element.id;
            } else {
                let random = (Math.random() + 1).toString(36).substring(7);
                id = 'el_pass_'+random;
                element.setAttribute('id', id);
            }

            let button = document.createElement('button');
            button.classList.add('btn', 'btn-sm', 'btn-light', 'input-group-btn', 'password_toggler');
            button.setAttribute('type', 'button');
            button.dataset.targetId = id;
            button.dataset.status = 'hidden';

            let icon = document.createElement('i');
            icon.classList.add('fa', 'fa-eye');
            button.appendChild(icon);

            var copy = element.cloneNode();
            var wrapper = document.createElement('div');
            wrapper.classList.add('input-group');
            wrapper.appendChild(copy);
            wrapper.appendChild(button);

            element.insertAdjacentElement("afterend", wrapper);
            element.remove();

            button.addEventListener( 'click', function ( event ) {
                let id = event.target.dataset.targetId;
                let target = document.getElementById(id);
                let me = event.target;
                let icon = this.querySelector('i');
                let type;
                switch (me.dataset.status) {
                    case 'hidden':
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                        me.dataset.status = 'visible';
                        type = 'text';
                    break;
                    case 'visible':
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                        me.dataset.status = 'hidden';
                        type = 'password';
                    break;
                }

                let new_input = document.createElement('input');
                new_input.setAttribute('type', type);
                new_input.setAttribute('id', id);
                new_input.setAttribute('name', target.name);
                if (target.hasAttribute('max-length')) {
                    new_input.maxLength = target.maxLength;
                }
                new_input.className = target.className;
                new_input.value = target.value;
                target.insertAdjacentElement("beforebegin", new_input);
                target.remove();
            }, true);
        });
    };
})();
(function () {
    'use strict';

    admin.parts.publicLinksPopup = function () {
        $(document).ready(function () {
            /**
             * Modal: show a public file's URL
             */
            $('body').on('click', '.public_link', function (e) {
                var type = $(this).data('type');
                var file_title = $(this).data('title');
                var public_url = $(this).data('public-url');

                if (type == 'group') {
                    var note_text = json_strings.translations.public_group_note;
                } else if (type == 'file') {
                    var note_text = json_strings.translations.public_file_note;
                }

                var modal_content = `
                <div class="public_link_modal">
                    <p>` + file_title + `</p>
                    <div class="">
                        <textarea class="input-large form-control" rows="4" readonly>` + public_url + `</textarea>
                        <button class="public_link_copy btn btn-primary" data-copy-text="` + public_url + `">
                            <i class="fa fa-files-o" aria-hidden="true"></i> ` + json_strings.translations.click_to_copy + `
                        </button>
                    </div>
                    <p class="note">` + note_text + `</p>
                </div>`;

                Swal.fire({
                    title: json_strings.translations.public_url,
                    html: modal_content,
                    showCloseButton: false,
                    showCancelButton: false,
                    showConfirmButton: false,
                    showClass: {
                        popup: 'animate__animated animated__fast animate__fadeInUp'
                    },
                    hideClass: {
                        popup: 'animate__animated animated__fast animate__fadeOutDown'
                    }
                }).then((result) => {});
            });

            /** Used on the public link modal on both manage files and the upload results */
            $(document).on('click', '.public_link_copy', function(e) {
                var text = $(this).data('copy-text');
                copyTextToClipboard(text);
            });
        });
    };
})();
(function () {
    'use strict';

    admin.parts.select2 = function () {

        $(document).ready(function(){
            $('.select2').select2({
                width: '100%',
                theme: "bootstrap-5",
            });

            $('.add-all').on('click', function() {
                var target = $(this).data('target');
                var selector = $('#'+target);
                $(selector).hide();
                $(selector).find('option').each(function() {
                    $(this).prop('selected', true);
                });
                $(selector).trigger('change');
                return false;
            });

            $('.remove-all').on('click', function() {
                var target = $(this).data('target');
                var selector = $('#'+target);
                selector.val(null).trigger('change');
                return false;
            });

            $('.copy-all').on('click', function() {
                if ( confirm( json_strings.translations.upload_form.copy_selection ) ) {
                    var target = $(this).data('target');
                    var type = $(this).data('type');
                    var selector = $('#'+target);
                    var val;
    
                    var selected = new Array();
                    $(selector).find('option:selected').each(function() {
                        selected.push($(this).val().toString());
                    });

                    $('.select2[data-type="'+type+'"]').not(selector).each(function() {
                        $(this).find('option').each(function() {
                            val = $(this).val().toString();
                            if (selected.includes(val)) {
                                $(this).prop('selected', 'selected');
                            } else {
                                $(this).removeAttr('selected');
                            }
                        });
                        $(this).trigger('change');
                    });
                }

                return false;
            });
        });
    };
})();
let sideModal = class {
    constructor()
    {
        let markup = `
            <div id="side_modal_cover"></div>

            <div id="side_modal" class="hidden" >
                <div id="side_modal_internal">
                    <div id="sm_header">
                        <span class="dismiss">
                            <span class="fa-stack fa-lg">
                                <i class="fa fa-circle-thin fa-stack-2x"></i>
                                <i class="fa fa-times fa-stack-1x"></i>
                            </span>
                        </span>
                        <div class="title">
                            <h5></h5>
                        </div>
                    </div>
                    <div class="slideDown loader" id="side_modal_loading_indicator">
                        Loading...
                    </div>
                    <div class="contentarea">
                        <div class="content"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('afterend', markup);

        this.triggers = document.querySelectorAll("[data-side-modal]");
        this.cover = document.getElementById('side_modal_cover');
        this.modal = document.getElementById('side_modal');
        this.header = document.getElementById('sm_header');
        this.closeButton = this.header.querySelector('.dismiss');
        this.titleEl = this.header.querySelector('h5');
        this.loader = this.modal.querySelector('.loader');
        this.contentArea = this.modal.querySelector('.content');
        this.isOpen = false;
        this.closeWithButtonOnly = false;
    }

    setUp() {
        document.addEventListener('click', this.shouldOpenSideModal.bind(this));

        this.triggers.forEach(trigger => {
            trigger.addEventListener("click", this.openSideModalAndLoadContent.bind(this));
        });

        this.cover.addEventListener("click", this.closeSideModalFromCover.bind(this));
        this.closeButton.addEventListener("click", this.closeSideModal.bind(this));

        document.addEventListener("keydown", this.closeWithEscKey.bind(this));
    }

    changeCloseWithButtonOnly(value)
    {
        if (typeof value == "boolean") {
            this.closeWithButtonOnly = value;
        }
    }

    closeWithEscKey(e)
    {
        if (e.keyCode === 27 && this.closeWithButtonOnly == false) {
            this.closeSideModal();
        }
    }

    closeSideModalFromCover()
    {
        if (this.closeWithButtonOnly == false) {
            this.closeSideModal();
        }
    }

    shouldOpenSideModal(e)
    {
        if (e.target && e.target.dataset.sideModal) {
            this.openSideModal();
        }
    }

    openSideModal(e)
    {
        this.isOpen = true;
        this.cover.classList.add('visible');
        this.modal.classList.remove('hidden');
        document.body.classList.add('ox-h');
    }

    openSideModalAndLoadContent(e)
    {
        e.preventDefault();
        this.isOpen = true;
        this.cover.classList.add('visible');
        this.modal.classList.remove('hidden');
        document.body.classList.add('ox-h');

        this.cleanAndSetLoading();
        this.setTitle(e.target.dataset.title);

        let url = e.target.href;
        let that = this;

        axios.get(url, {
        })
        .then(function (response) {
            that.setContent(response.data);
        })
        .catch(function (error) {
            toastr.error(json_strings.translations.cannot_load_content);

            that.setTitle('');
            that.setContent('');
            that.closeSideModal();
        });

    }

    closeSideModal()
    {
        if (this.isOpen) {
            this.isOpen = false;
            this.cover.classList.remove('visible');
            this.modal.classList.add('hidden');
            document.body.classList.remove('ox-h');

            this.clean();
        }
    }

    setTitle(title)
    {
        this.titleEl.innerHTML = title;
    }

    setContent(content)
    {
        this.contentArea.innerHTML = content;
        this.loader.classList.remove('visible');
    }

    clean()
    {
        this.contentArea.innerHTML = "";
    }

    cleanAndSetLoading()
    {
        this.clean();
        this.loader.classList.add('visible');
    }
};

window.smd = new sideModal();
window.smd.setUp();

(function () {
    'use strict';
    
    admin.parts.widgetActionLog = function () {
        
        $(document).ready(function(){
            // Action log
            function ajax_widget_log( action ) {
                var target = $('#log_container');
                var select = $('#widget_actions_log_change');
                var list = $('<ul/>').addClass('none');

                target.html('');
                select.attr('disabled', 'disabled');
                $('#widget_actions_log .loading-icon').removeClass('none');

                $.ajax({
                    url: json_strings.uri.widgets+'ajax/actions-log.php',
                    data: { action:action },
                    cache: false,
                }).done(function(data) {
                    var obj = JSON.parse(data);
                    //console.log(obj);
                    $.each(obj.actions, function(i, item) {
                        var line = [];
                        var parts = {
                            part1: item.part1,
                            action: item.action,
                            part2: item.part2,
                            part3: item.part3,
                            part4: item.part4,
                        }

                        for (const key in parts) {
                            if (parts[key]) {
                                line.push('<span class="item_'+key+'">'+parts[key]+'</span>');
                            }
                        };

                        var icon;
                        switch (item.type) {
                            case 'system': icon = 'cog'; break;
                            case 'auth': icon = 'lock'; break;
                            case 'files': icon = 'file'; break;
                            case 'clients': icon = 'address-card'; break;
                            case 'users': icon = 'users'; break;
                            case 'groups': icon = 'th-large'; break;
                            case 'categories': icon = 'object-group'; break;
                            default: icon = 'cog'; break;
                        }
                        line = line.join(' ');
                        var li = $('<li/>')
                            .appendTo(list)
                            .html(`
                                <div class="date">
                                    <span>`+
                                        item.timestamp+`
                                    </span>
                                    <i class="fa fa-`+icon+`" aria-hidden="true"></i>
                                </div>
                                <div class="action">`+
                                    htmlEncode(item.formatted)+`
                                </div>
                            `);
                    });
                    //console.log(list);
                    target.append(list);
                    list.slideDown();
                }).fail(function(data) {
                    target.html(json_strings.translations.failed_loading_resource);
                }).always(function() {
                    $('#widget_actions_log .loading-icon').addClass('none');
                });

                $(select).removeAttr('disabled');
            }

            // Action log
            $('#widget_actions_log_change').on('change', function(e) {
                var action = $('#widget_actions_log_change option').filter(':selected').val()
                ajax_widget_log(action);
            });

			ajax_widget_log();
        });
    };
})();
(function () {
    'use strict';
    
    admin.parts.widgetNews = function () {
        
        $(document).ready(function(){
            // Action log
            function ajax_widget_news( action ) {
                var target = $('#news_container');
                var list = $('<ul/>').addClass('none home_news list-unstyled');

                target.html('');
                $('#widget_projectsend_news .loading-icon').removeClass('none');

                $.ajax({
                    url: json_strings.uri.widgets+'ajax/news.php',
                    cache: false,
                }).done(function(data) {
                    // var obj = JSON.parse(data);
                    var obj = data;
                    $.each(obj.items, function(i, item) {
                        var li = $('<li/>')
                            .appendTo(list)
                            .html(`
                                <span class="date">`+item.date+`</span>
                                    <a href="`+item.url+`" target="_blank">
                                        <h5>`+item.title+`</h5>
                                    </a>
                                <p>`+item.content+`</p>
                            `);
                    });
                    //console.log(list);
                    target.append(list);
                    list.slideDown();
                }).fail(function(data) {
                    target.html(json_strings.translations.failed_loading_resource);
                }).always(function() {
                    $('#widget_projectsend_news .loading-icon').addClass('none');
                });
            }

			ajax_widget_news();
        });
    };
})();

(function () {
    'use strict';
    
    admin.parts.widgetStatistics = function () {
        
        $(document).ready(function(){
            var chart;

            // Statistics chart
            function ajax_widget_statistics(days) {
                var _chart_container = $('#widget_statistics #chart_container');
                _chart_container.find('canvas').remove();
                $('#widget_statistics .loading-icon').removeClass('none');
                if (chart) {
                    chart.destroy();
                }
                $.ajax({
                    url: json_strings.uri.widgets+'ajax/statistics.php',
                    data: { days:days },
                    cache: false,
                }).done(function(data) {
                    // var obj = JSON.parse(data);
                    var obj = data;
                    _chart_container.append('<canvas id="chart_statistics"><canvas>');
                    chart = new Chart(document.getElementById('chart_statistics'), {
                        type: 'line',
                        data: obj.chart,
                        options: {
                            responsive: true,
                            title: {
                                display: false
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false
                            },
                            scales: {
                                xAxes: [{
                                    display: true,
                                }],
                                yAxes: [{
                                    display: true
                                }]
                            },
                            elements: {
                                line: {
                                    tension: 0
                                }
                            }
                        }
                    });
                }).fail(function(data) {
                    _chart_container.html(json_strings.translations.failed_loading_resource);
                }).always(function() {
                    $('#widget_statistics .loading-icon').addClass('none');
                });
    
                return;
            }

            // Statistics
            $('#widget_statistics button.get_statistics').on('click', function(e) {
                if ($(this).hasClass('active')) {
                    return false;
                }
                else {
                    var days = $(this).data('days');
                    $('#widget_statistics button.get_statistics').removeClass('btn-primary active').addClass('btn-pslight');
                    $(this).addClass('btn-primary active').removeClass('btn-pslight');
                    ajax_widget_statistics(days);
                }
            });

			ajax_widget_statistics(15);
        });
    };
})();
//# sourceMappingURL=app.js.map
