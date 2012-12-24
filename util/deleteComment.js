/**
 * Created with JetBrains WebStorm.
 * User: tafeng.dxx
 * Date: 12-12-18
 * Time: 下午6:07
 */

var Reg = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*))$/mg

function compareSq(str) {

}

function deleteComment(str) {
    var str_flag = false,
        comment_flag = false;
    var sq_index = str.indexOf("'"),
        dq_index = str.indexOf('"'),
        scm_index = str.indexOf('//'),
        ncm_index = str.indexOf('/*'),
        cur_index = str.length;

    //无注释
    if(ncm_index == -1 && scm_index == -1) {
        return;
    }

    //无字符串
    if(sq_index == -1 && dq_index == -1) {
        return str.replace(Reg, '');
    }
}
var t = deleteComment($0.value);