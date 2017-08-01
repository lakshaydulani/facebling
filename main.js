$(function () {

	document.getElementById('files').onchange = function (e) {
		ctrack.reset();
		var loadingImage = loadImage(
			e.target.files[0],
			function (img) {
				
				$("#image").remove();
				$(img).attr('id', 'image');
				$("#container").prepend(img);
				var $img = $("#image");
				wid = $img.attr('width');
				hei = $img.attr('height');
				document.querySelector("#overlay").height = hei;
				document.querySelector("#overlay").width = wid;
				$(".earring-descriptor").hide();
				$("#bottom-bar").css("background-color", "purple").html("Looking for ur face...");

				cc = document.getElementById('image').getContext('2d');
				overlay = document.getElementById('overlay');
				overlayCC = overlay.getContext('2d');

				animateClean();
			}, {
				maxWidth: screen.width,
				maxHeight: screen.height,
				orientation: true
			}
		);

	};

	$("#bottom-bar").click(function () {
		$("#files").click();
	});

});


var wid, hei;



var ctrack = new clm.tracker({
	stopOnConvergence: true
});
ctrack.init();
var drawRequest;









function animateClean() {
	ctrack.start(document.getElementById('image'));
	drawLoop();
}

function animate(box) {
	ctrack.start(document.getElementById('image'), box);
	drawLoop();
}

function drawLoop() {
	drawRequest = requestAnimFrame(drawLoop);
	overlayCC.clearRect(0, 0, wid, hei);
	if (ctrack.getCurrentPosition()) {
		ctrack.draw(overlay);
	}
}

// detect if tracker fails to find a face
document.addEventListener("clmtrackrNotFound clmtrackrLost", function (event) {
	ctrack.stop();
	$("#bottom-bar").html("Bad!").css("background-color", "red");
}, false);

// detect if tracker has converged
document.addEventListener("clmtrackrConverged", function (event) {
	window.faceModel = ctrack.getCurrentPosition();

	$("#bottom-bar").html("Looks good! Try in another pose?").css('background-color', 'green');

	addEarring();
	cancelRequestAnimFrame(drawRequest);
}, false);

function addEarring() {
	var temp1 = window.faceModel;
	var base_image = new Image();
	base_image.src = $("#tryUrl").val();
	base_image.onload = function () {
		overlayCC.clearRect(0, 0, wid, hei);
		overlayCC.drawImage(base_image, temp1[1][0] - base_image.width / 2, temp1[1][1] + 10);
		overlayCC.drawImage(base_image, temp1[12][0] - 10, temp1[13][1] + 10);
	}
}




/* 
function loadImage() {
	if (fileList.indexOf(fileIndex) < 0) {
		var reader = new FileReader();
		reader.onload = (function (theFile) {
			return function (e) {
				var canvas = document.getElementById('image')
				var cc = canvas.getContext('2d');
				var img = new Image();
				img.onload = function () {
					$("#top-bar").slideUp();
					$("#image,#overlay").show();
					$(".earring-descriptor").hide();
					$("#bottom-bar").css("background-color", "purple").html("Looking for ur face...");

					if (img.height > hei || img.width > wid) {
						var rel = img.height / img.width;
						var neww = wid;
						var newh = neww * rel;
						if (newh > hei) {
							newh = hei;
							neww = newh / rel;
						}
						canvas.setAttribute('width', neww);
						canvas.setAttribute('height', newh);
						overlay.setAttribute('width', neww);
						overlay.setAttribute('height', newh);

						if (iOS) {

							cc.translate(neww * 0.5, newh * 0.5);
							cc.rotate(90 * 0.01745);
							cc.translate(-neww * 0.5, -newh * 0.5);
						}
						cc.drawImage(img, 0, 0, neww, newh);
						animateClean();
					} else {
						wei = img.width;
						hei = img.height;
						canvas.setAttribute('width', img.width);
						canvas.setAttribute('height', img.height);
						overlay.setAttribute('width', img.width);
						overlay.setAttribute('height', img.height);
						if (iOS) {
							cc.translate(img.width * 0.5, img.height * 0.5);
							cc.rotate(90 * 0.01745);
							cc.translate(-img.width * 0.5, -img.height * 0.5);
						}
						cc.drawImage(img, 0, 0, img.width, img.height);
					}

					if (iOS)
						cc.restore();

				}

				img.src = e.target.result;
			};
		})(fileList[fileIndex]);
		reader.readAsDataURL(fileList[fileIndex]);
		overlayCC.clearRect(0, 0, wid, hei);
		//document.getElementById('convergence').innerHTML = "";
		ctrack.reset();
	}

}
var fileList, fileIndex;
if (window.File && window.FileReader && window.FileList) {
	function handleFileSelect(evt) {
		var files = evt.target.files;
		fileList = [];
		for (var i = 0; i < files.length; i++) {
			if (!files[i].type.match('image.*')) {
				continue;
			}
			fileList.push(files[i]);
		}
		if (files.length > 0) {
			fileIndex = 0;
		}

		loadImage();
	}
	document.getElementById('files').addEventListener('change', handleFileSelect, false);
} */