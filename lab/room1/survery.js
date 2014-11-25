/**
 * Created by msyk on 2013/10/16.
 */

function dateTimeForSQL(dt) {
    return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate()
        + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()
}