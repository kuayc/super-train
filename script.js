let index = 0;
      const config = {
        apiKey: "AIzaSyANx2eNT575hmMOsw5CVY1w0zpYscay-qU",
        authDomain: "trainproject-8d2fb.firebaseapp.com",
        databaseURL: "https://trainproject-8d2fb.firebaseio.com",
        projectId: "trainproject-8d2fb",
        storageBucket: "",
        messagingSenderId: "533164757715"
      };
      firebase.initializeApp(config);
      let database = firebase.database();
      $("#formID").on("submit", function(e) {
        e.preventDefault();
        var name = $("#trainName")
          .val()
          .trim();
        var destination = $("#trainDestination")
          .val()
          .trim();
        var firstTime = $("#firstTrainTime")
          .val()
          .trim();
        var frequency = $("#frequency")
          .val()
          .trim();
        database.ref().push({
          name: name,
          destination: destination,
          firstTime: firstTime,
          frequency: frequency
        });
        $("#trainName").val("");
        $("#trainDestination").val("");
        $("#firstTrainTime").val("");
        $("#frequency").val("");
        return false;
      });
      database
        .ref()
        .orderByChild("dateAdded")
        .on(
          "child_added",
          function(childSnapshot) {
            let updateButton = $("<button>")
              .html("<span class='glyphicon glyphicon-edit'></span>")
              .addClass("updateButton")
              .attr("data-index", index)
              .attr("data-key", childSnapshot.key);
            let removeButton = $("<button>")
              .html("<span class='glyphicon glyphicon-remove'></span>")
              .addClass("removeButton")
              .attr("data-index", index)
              .attr("data-key", childSnapshot.key);

            let firstTime = childSnapshot.val().firstTime;
            let tFrequency = parseInt(childSnapshot.val().frequency);
            let firstTrain = moment(firstTime, "HH:mm").subtract(1, "years");
            console.log(firstTrain);
            console.log(firstTime);
            let currentTime = moment();
            let currentTimeCalc = moment().subtract(1, "years");
            let diffTime = moment().diff(moment(firstTrain), "minutes");
            let tRemainder = diffTime % tFrequency;
            let minutesRemaining = tFrequency - tRemainder;
            let nextTRain = moment()
              .add(minutesRemaining, "minutes")
              .format("hh:mm A");
            let beforeCalc = moment(firstTrain).diff(
              currentTimeCalc,
              "minutes"
            );
            let beforeMinutes = Math.ceil(
              moment.duration(beforeCalc).asMinutes()
            );
            if (currentTimeCalc - firstTrain < 0) {
              nextTrain = childSnapshot.val().firstTime;
              console.log("Before First Train");
              minutesRemaining = beforeMinutes;
            } else {
              nextTrain = moment()
                .add(minutesRemaining, "minutes")
                .format("hh:mm A");
              minutesRemaining = tFrequency - tRemainder;
              console.log("Working");
            }
            var newRow = $("<tr>");
            newRow.addClass("row-" + index);
            var cell1 = $("<td>").append(updateButton);
            var cell2 = $("<td>").text(childSnapshot.val().name);
            var cell3 = $("<td>").text(childSnapshot.val().destination);
            var cell4 = $("<td>").text(childSnapshot.val().frequency);
            var cell5 = $("<td>").text(nextTrain);
            var cell6 = $("<td>").text(minutesRemaining);
            var cell7 = $("<td>").append(removeButton);
            newRow
              .append(cell1)
              .append(cell2)
              .append(cell3)
              .append(cell4)
              .append(cell5)
              .append(cell6)
              .append(cell7);
            $("#tableContent").append(newRow);
            index++;
          },
          function(error) {
            alert(error.code);
          }
        );
      function removeRow() {
        $(".row-" + $(this).attr("data-index")).remove();
        database
          .ref()
          .child($(this).attr("data-key"))
          .remove();
      }
      function editRow() {
        $(".row-" + $(this).attr("data-index"))
          .children()
          .eq(1)
          .html("<textarea class='newName'></textarea>");
        $(".row-" + $(this).attr("data-index"))
          .children()
          .eq(2)
          .html("<textarea class='newDestination'></textarea>");
        $(".row-" + $(this).attr("data-index"))
          .children()
          .eq(3)
          .html("<textarea class='newFrequency' type='number'></textarea>");
        $(this)
          .toggleClass("updateButton")
          .toggleClass("submitButton");
      }
      function submitRow() {
        var newName = $(".newName")
          .val()
          .trim();
        var newDestination = $(".newDestination")
          .val()
          .trim();
        var newFrequency = $(".newFrequency")
          .val()
          .trim();
        database
          .ref()
          .child($(this).attr("data-key"))
          .child("name")
          .set(newName);
        database
          .ref()
          .child($(this).attr("data-key"))
          .child("destination")
          .set(newDestination);
        database
          .ref()
          .child($(this).attr("data-key"))
          .child("frequency")
          .set(newFrequency);
        $(".row-" + $(this).attr("data-index"))
          .children()
          .eq(1)
          .html(newName);
        $(".row-" + $(this).attr("data-index"))
          .children()
          .eq(2)
          .html(newDestination);
        $(".row-" + $(this).attr("data-index"))
          .children()
          .eq(3)
          .html(newFrequency);
        $(this)
          .toggleClass("updateButton")
          .toggleClass("submitButton");
      }
      $(document).on("click", ".removeButton", removeRow);
      $(document).on("click", ".updateButton", editRow);
      $(document).on("click", ".submitButton", submitRow);