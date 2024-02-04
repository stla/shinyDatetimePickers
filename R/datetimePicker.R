#' Datetime picker
#' @description A datetime picker for a Shiny UI.
#'
#' @param inputId the input slot that will be used to access the value
#' @param value initial value, either a \code{POSIXct} object, or an object
#'   coercible to a \code{POSIXct} object;
#'   if \code{NULL}, it is set to the current time
#' @param style inline CSS for the container
#'
#' @importFrom reactR createReactShinyInput
#' @importFrom htmltools htmlDependency tags
#' @export
#'
#' @return A \code{shiny.tag} object that can be included in a Shiny UI.
#'
#' @examples if(interactive()){
#'
#' library(shinyDatetimePickers)
#' library(shiny)
#'
#' ui <- fluidPage(
#'   br(),
#'   sidebarLayout(
#'     sidebarPanel(
#'       tags$fieldset(
#'         tags$legend("Click to change time"),
#'         datetimePickerInput(
#'           "dtpicker",
#'           style =
#'             "font-family: Montserrat, 'Segoe UI', Tahoma, sans-serif;"
#'         )
#'       )
#'     ),
#'     mainPanel(
#'       verbatimTextOutput("dtpicker")
#'     )
#'   )
#' )
#'
#' server <- function(input, output){
#'   output[["dtpicker"]] <- renderPrint({
#'     input[["dtpicker"]]
#'   })
#' }
#'
#' shinyApp(ui, server)
#'
#' }
datetimePickerInput <- function(inputId, value = NULL, style = NULL) {
  value <- if(is.null(value)) Sys.time() else as.POSIXct(value)
  reactR::createReactShinyInput(
    inputId,
    "datetimePicker",
    list(
      htmltools::htmlDependency(
        name = "datetimePicker-input",
        version = "1.0.0",
        src = "www/datetimePicker",
        package = "shinyDatetimePickers",
        script = "datetimePicker.js"
      ),
      cssDependency
    ),
    NULL,
    list(
      shinyId = inputId,
      value = datetime2list(value, sec = TRUE)
    ),
    container = function(...) htmltools::tags$div(..., style = style)
  )
}

#' @title Update a datetime picker widget
#' @description Change the value of a datetime picker input.
#' @param session the Shiny \code{session} object
#' @param inputId the id of the datetime picker widget to be updated
#' @param value new value for the datetime picker widget
#'
#' @return No returned value, this just updates the widget.
#' @export
updateDatetimePickerInput <- function(session, inputId, value) {
  session$sendCustomMessage(
    paste0("updateValue_", inputId),
    datetime2list(value, sec = TRUE)
  )
}
