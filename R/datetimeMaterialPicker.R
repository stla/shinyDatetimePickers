#' Material design datetime picker
#' @description A datetime picker for a Shiny UI.
#'
#' @param inputId the input slot that will be used to access the value
#' @param label a label, a character string (HTML is not allowed), or
#'   \code{NULL} for no label
#' @param value initial value, either a \code{POSIXct} object, or an object
#'   coercible to a \code{POSIXct} object;
#'   if \code{NULL}, it is set to the current time
#' @param disablePast logical, whether to disable past dates
#' @param disableFuture logical, whether to disable future dates
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
#'       datetimeMaterialPickerInput(
#'         "dtmpicker",
#'         label = "Appointment",
#'         disablePast = TRUE
#'       )
#'     ),
#'     mainPanel(
#'       verbatimTextOutput("dtmpicker")
#'     )
#'   )
#' )
#'
#' server <- function(input, output){
#'   output[["dtmpicker"]] <- renderPrint({
#'     input[["dtmpicker"]]
#'   })
#' }
#'
#' shinyApp(ui, server)
#'
#' }
datetimeMaterialPickerInput <- function(
  inputId, label = NULL, value = NULL,
  disablePast = FALSE, disableFuture = FALSE,
  style = NULL
) {
  label <- if(!is.null(label)) as.character(label)
  value <- if(is.null(value)) Sys.time() else as.POSIXct(value)
  reactR::createReactShinyInput(
    inputId,
    "datetimeMaterialPicker",
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
      value = datetime2list(value, sec = TRUE),
      label = label,
      disableFuture = disableFuture,
      disablePast = disablePast
    ),
    container = function(...) htmltools::tags$div(..., style = style)
  )
}

#' @title Update a datetime material picker widget
#' @description Change the value of a datetime material picker input.
#' @param session the Shiny \code{session} object
#' @param inputId the id of the datetime material picker widget to be updated
#' @param value new value for the datetime material picker widget
#'
#' @return No returned value, this just updates the widget.
#' @export
updateDatetimeMaterialPickerInput <- function(session, inputId, value) {
  session$sendCustomMessage(
    paste0("updateValue_", inputId),
    datetime2list(value, sec = TRUE)
  )
}
