
/* ------ JavaScript - Image Into Interactive Particles ------ */ 

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

// mouse object parameters
let mouse = {
    x: null,
    y: null,
    radius: 100
}
// mouse event listener
window.addEventListener('mousemove',
    function(event){
        mouse.x = event.x + canvas.clientLeft/2;
        mouse.y = event.y + canvas.clientTop/2;
    }
);

function drawImage(){
    let imageWidth = png.width;
    let imageHeight = png.height;
    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // particles created from image data
    class Particle {
        constructor(x, y, color, size){
            this.x = x + canvas.width/2 - png.width * 2,
            this.y = y + canvas.height/2 - png.height * 2,
            this.color = color,
            this.size = 2,
            this.baseX = x + canvas.width/2 - png.width * 2,
            this.baseY = y + canvas.height/2 - png.height * 2,
            this.density = (Math.random() * 10) + 2;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            ctx.fillStyle = this.color;

            // collision detection - Note # dx = delta x
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            // max distance, past where the force will be 0
            const maxDistance = 100;
            let force = (maxDistance - distance) / maxDistance;
            if (force < 0) force = 0;

            let directionX = (forceDirectionX * force * this.density * 0.6);
            let directionY = (forceDirectionY * force * this.density * 0.6);

            if (distance < mouse.radius + this.size) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX){
                    let dx = this.x - this.baseX;
                    this.x -= dx/20;
                } 
                if (this.y !== this.baseY){
                    let dy = this.y - this.baseY;
                    this.y -= dy/20;
                }
            }
            this.draw()
        }
    }
    function init() {
        particleArray = [];

        for (let y = 0, y2 = data.height; y < y2; y++) {
            for (let x = 0, x2 = data.width; x < x2; x++) {
                if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
                    let positionX = x;
                    let positionY = y;
                    let color = "rgb(" + data.data[(y * 4 * data.width) + (x * 4)] + "," +
                                        data.data[(y * 4 * data.width) + (x * 4) + 1] + "," +
                                        data.data[(y * 4 * data.width) + (x * 4) + 2] + ")";
                    particleArray.push(new Particle(positionX * 4, positionY * 4, color)); // scales our image size by times 4.
                }
            }
        }
    }
    function animate() {
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0,0,0,.05)';
        ctx.fillRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].update();
        }
    }
    init();
    animate();

    // responsive resize screen
    window.addEventListener('resize',
        function() {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
        }
    );
}
// converted 100x100 pixel png image into Base64 data
const png = new Image();
png.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAC4jAAAuIwF4pT92AAAF3mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDg4LCAyMDIwLzA3LzEwLTIyOjA2OjUzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMTEtMTFUMTQ6MTg6MDRaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTExLTExVDE0OjE4OjA0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMTEtMTFUMTQ6MTg6MDRaIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjc5MTI4ZDRkLTdhYzEtNGMzMy1hMDIxLWQ3ZjVmODIxMDEyOCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjk0NmIyZTdjLWFjZTAtYzY0Zi05ODNkLWJhYTJlZGM1NGUwMSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjAyNzA5OGU3LWYwZTMtNGQ0OC1hNTE3LTBiMTg4N2Q2YjdlNSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDI3MDk4ZTctZjBlMy00ZDQ4LWE1MTctMGIxODg3ZDZiN2U1IiBzdEV2dDp3aGVuPSIyMDIwLTExLTExVDE0OjE4OjA0WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjAgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjc5MTI4ZDRkLTdhYzEtNGMzMy1hMDIxLWQ3ZjVmODIxMDEyOCIgc3RFdnQ6d2hlbj0iMjAyMC0xMS0xMVQxNDoxODowNFoiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4wIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuYC11sAADK3SURBVHic7Z13vI/1///v13jv93mfzeHgnMMxjuyZLSQku5KiUpGPlIp2vg1UokVCdqEyokKRyEp29t7jTGe/17V+f1zHPsZBHz632+9xu7nhGq/3dT0fr+d8jUswDIP/jzsH8tl/lClT6nY+x62GE3gK6Az8AnwK3Jaed+zYiSJdL1/7kv8tCFDaHxTmyJJRT5I4DTzEbSLjRvC/QIiIKdBrClWAkHy/8FOjmoEa3oDA9r3WH6wWI72QS60GhAmmJnmBXEADlOv5nX8TdxIhIhAF1AIaGgZVvH6hlKYJHkAXBNJFwThisbDBIht/CAI7L20gqAhvlY7RaowbdoYXh4ajaWRgOXe6lKIKnQJB7jV0Icnp1MNlCadhYAA7ge+AKUDWf+Nlr4Q7hRAb8CTwAlBJ0yA6Uue5+/MpF6+SkyuSki5x8LjcZPteS88jx2VF0VjptBtjRZF5BW3E+INC3+cfz6VEoobPLwCogCOoCEOCQfrEl9IiGtYKcHedAPv2y4z/LgSb1RgKjANO3pY3vwR3CiEBzN65GKgrijycmS22X7PJZq9dLUi37l7TkPggL0tgw3abZdZPzpaLVzha5vuEpS6H8ZyqUqd0CTW0UysvKBAeqqMbtMjzCg+UKaE1GPBELp1be4kooUMQ7u9VDMNgPPC2YRCn6TyoKEJ1TaeMoQvFEAzRYcOQZSMdOAhsANYCGf+mIO4UQsAk5ShwVBCYYxhUXvePbeDq52y9u7XxSh++nkVEhI7baXBPMz/3NPWzYZOV4V+G3rt8nX2NYZDRspKf8GI6GBAfq5KdK7bq3MrHZ++cITZBM72FAVNnulm9yeZ32I1gbr74p0U26heP0mzxsSqlSmiULqEhiQZ/rrfzzx4LknjuGdOBBcAM4G/MFm8p7iRCLsUuu83oY1iZ/t1C17ijp+S7Zn2RTkS4fk4MdesEmfNVGp9N8kR9OM4TVa9aECTzXNnSGq0a+Zn+WToOlwE5gATeMwKjvw1B1bDFlVQHtGrsp2VDP1XLK0RHaxAOx3fJjBwfwoGjMoLAX8B8YIvZAqFAOBDJv0CIcDYxvEPzENkwcAINMrPFbx5p742eMCIDQeV8LCQBVji0T6Z4lIbLaYAIySkSkgjRMRoEC651wHeznYydGcJzvXJp29xHSJRhxlcAOoyb7mbEeI+WmSMtczv1dwWBtTfzAkXNQ+40QjyaTn1FEZooqlDLMKhgtRiRFovhEAWsgaAgzR+bRsOGAfBfcqcV04XrBf+XAKHg2FkIsO+QhfhSKtZwA3yYZFggPVPkxXfDmfmzC6fd8Dnsxky7zVgFbAP+uaDlIuF/lZCq/oDQR1GEDuGhepkKCQrVKgWplKBSqqRKsXAdl0NH1QSiIzSiIvUbFA9gwSThAuIyskU+/DKUg8dkEuMVZCscPCyzdosNAAH2AxOAaUBaUX7uf42Q8GBQeF/VeLpm5aCtazsvrRr4SSyjmimbgCm4s3/O9njtKi0WFQIEAgKaBs5wA+yQc1qk9ysRrNlsS7bIbMXUtyggFZgDzAayr6f5/6XSSVK+V/g+MU6t+vaAbNrf7wMXZqx11kcE+fdzZwNsNsMkOwCGAc+/E87cxS6KRWurwHgTU0MAQoBi/+YT3S4NKRVUhFWtGvrj3xyQTb5PYPM/Vo6dkgkEBRx2g8Q4hfrVg8SXVrFZjP9eQUOAv7baWLrGzu9r7Ow+YAnoBouddmOUILC6qM39T5gsw2CB3WZ0aFwnwN5DFg4clf1BRTgkCBwTMM4YCIk+v1AvJlpj/LAM7mvuPx8p/TdgB2QIZAksW2dn6hwXK9bZMQxmOuzG/wEHrrep/wVCmgArAfwBYbkk8p0sG8sFgUOY3iE2zyvMTSyj1h/5RiZN6wcujpRuBhJF8z8i4AAU+HWFnY/He9i0w5bhduqviyJfX08TdzohAjALKA4MAVZdcr5iTp64uHHtQMKEDzMoWUaDvFvzw5oOGZkSxaK1okdoAuAEb7bApxM9jJkegm4w2W41BhjXSA6LSoh47UtuKezAVKAFl5MRl5svLm5Wz5/w7efplCx568hAMGU6/3cHSrDgP0WBAeSD027w5uBsvhmVTnS41jvfJywUTCd/y/DfJsQH/MolLloAZ75P+L5ulUDCtE8yCAvTzSsFChfe1QQqUOhbiRZYs8nGkRMS50ryBmac6cZMLK8FFciFVq39zB2XTsWyavNcr/CrIFDyOu6+Lvy3CSkUAUUYWjxSqz9u2BnCIgqSvhBAAr//gh4tAS7QNdALMzsCBIMCAX8hWiDAsdMyqzfbTD0FsMOqdTa+GBvCkSOymftcDzG5ULGSwg+j06haXqmZ5xXmCwJhN/Lul+K2E2JAHUXl+feez6ZsFRVEOHFSYsz4EDr3iWbLTqs5WuKEfJ/AuEkhvP9lKMbZDErgXFSEFdZutvHdQqcpXM5fo6tmjvHVzBByksVz9xw5KfPisAiaPRLOs4OdHDoimxpzLcl4ITZOY/onGcTHqnW9fmEa50qbN47bTojXJwxp2cAvdevuJT9V4INPQ2nZszgvDQ83MnNE6tQOgBWWLLPRokcEA96NoGKCiuTgXGFx1WobBw/J4IB1W61MmevGCHD+7QwQJXC7DLbulnjsxRAyz0hgg/rVAsRE+2nfqiN7DjehUTcn4yc7TLNmueJjFzw8xJVT+Xr4GdxOvYOiCu/erDxuKyGGQRVZot2rfXLY9o+F9r2L8eE4z4ncPHGk22F4X3wiB0skfPK5k8dejMKvlKdCgp/WjX2ggmYIDH7fQ/s+UZxMkUGClDMSa7dYmfeL0+zpZyGBw+bnvqZ1SMuuwT0P21i5zEqFOirt78nh+OkzLJs9gZf6DeKVDyN4ZpALf0As1IRpusP8hwDkQ616QYa/lE0wyBuGwb03I5PbSoiiCg9UrxSUdh2w0Kl3NNv3Wn4ODdHraDrHkhIVV8d7fbwzxMn/fR7Olx+8y/0tmpBQKoeIYjrIMGq8i0mzo3HYbeTmm28jCmC1CLw2ysWBnRazHGMAFihdwo/N5mDhjK+oUrkTHXq7eXaAndZNYOM/y5j23VwGD3mTn6d9wa+rytC9vxOfT7xYUwTwaSU4mtMFr1LKJCUPHnkwn+7tvUKeV/wS0wPeEG4rIbJkNDqVKvHmJ2H4AsJQp8PoAKQFFOGFnh3zmfSDnZGTw5gxeigPPvYwW3fuo0p5DdxwaI/MqMlWRr31HHWqV2flBgNkcDv81K5akaQKDenSz8rhA/I58dSvDpu3b8MqiHw78QtmfPUFew415fn3nSiKyjuffMKe1X/StP39/DZrLFt2x/GfNxwYggAiBLQo8oLx2OVkZNHL0ZyuZPhqmY3rMGRANqVLqOUVVXjlRmVyWwkRRcpn5YjoBs9aZN4G0HRal45RywUVg1dGOPjinUF0eKgLWmoap1NTKVcGsMDUuRZKFq/Ek0/04L4mdflxiYySLFA5USUnN5evhr1ByZimtHjExpLfbGCBVo1UFOU0y9esA1Hg/vvbsHzOJKZ/MY7unR7GYbfxzODXSNmzh8p1ajN/0kgWrSzB6IkOcIIs5uFTS3A4uzsBLQJBUEj1NiHdWw+CUDxOY+DjufgDDAQSbkgmt1C+RYUTcIgiz4oC488eNAzhIY/LYMy3Ik881IPeT/WCvHy8fj8+v5foSB2y4OflIt07tAaHk0e6tEPV4/n4Sxt319RIyzhKvtfP/JkTaNuyBw/2d/N4XwenMkSa1PEzdfYvoKjg9SIALVs2Z/TIj/j7lwW81Odp9u8/AN58IooX49HO9zJ8nIM92yxIDj/Rzr8o7lyFonsAEIUgab56ZPkrgw96dMynSgXFHQgKg25EKLeTEDvQH86TAThlyWh58LhORFgF3n/leQgGzaSjIJW0WQwOHxBJyQilbfOG4PUSFVuKEW88z4dfO1jwu52YqByWr92APdTD2E+G8cOE0Rw93YT7eobz9z8iS1YuZcXyFeB0mm17veD1EhYeTucunWncsAEYBqeOn+DPv1aTnSvx0YRQNBVAwGPbTyn3IgQ0dEPCLqdjlzJABXu4wdMP5hFUhB5ATFGFcjsJOQP8fMmx6kCZQCBIo7q1cEZFg6KAYeB02HE4XGTmCKzfJhIZHkvFxAQIKuD10u3BLgx95WXeHW3j6EmdNRv/Bp8f/H7uu+9eVsyZxJwJE3msaz8a1K7OF5OnkpWaCtIFqYNqag2qCoEgDe5pzvTRn1O2TDE2bgdvJhhCCEdzOnPGXxNRUBAE8Ckx5ClxIAjgh44tfcTFqmGKKjxYVKHc9jzkEtQFMDCoVK6smckBGAaS00mZkjFs3yuwcYdAhbJlsXk8ZtpuGODz8Xz/vkwaNYqSMWX5ffVKjh86BBbZFDLQsHED3h3yOku+n8W4D4ZiFcUrpPyALLN51Sr2Hz1K74c7k5xuYc4SF4IzB4eUSq6SgKY7sInphNl34deiCGoeUCGshE6rBn78AaFrUQVwpxFS0TAMbBaLXrFcOfOIwwF2O9jtNKpbjSVrZNZutlA9qSzIFwx4FpDSqXMHVsybzfNPPsnOffvNjPDseaNgoMuQKBZTGmdElGm25MIHTuPLlmXVmrWMHDceWRJ5d0wYO7ZYKBa+hij7BgxEDERinMspFbIIq3h+VLdlQz+SZNQsqgDutHlZJXRdPxbm8ZSoVqmimH8ml9V/bcUwoF69ajzW+X6+nDqJzOxsBvQuyWXDiIYB+fmEh4Xy2uCX0XJzwe8Hmw0Q+HPlZn5b/junU3dh6AHcrliq3dWAzm2bEx1bzNSks1qpaUR4PIwaNYLqlSvz4nsfUqWCRp4XFKUYWcEkREEloEWRnH8PJUOWnH8OBSrEK3hcBZ6/CLjTCMlTNe3PMqVK9Vy0fCNzF44jocw2JBEmz0qkacOnuL9FS76ZN4cSxYuZgxyFQVVBVZFkGVxOdvyzn5FfjkZkIe1bZFP7IXDY4MhJWLr2W3oPrMKDnQbS65EHIOAH/TzRyQcOUrdObV5+pjcTZ32NwwYWawbhth2k++ohCgpZwSQc/lOE23eYfUSAQFBA1Ypa57+zCHEAiywWS+s9B1NYsXoQo946Q3x5QAZf2g5GTx7M7oMNKBYVQ2iI53xvLgyCAC4Xs2YtZPp3/8eAJw7TroPZFlmAAMUSoV4zg5P7t/PaB/1JPp3MKy/3OedzEAQEWabf4FfJzs0hI9vNwKEiv05PJdq9DtBJ9TbGYz2AJAQwDBkBFSywaYeV3HzxVFGFcCcRogDzfT7pxQfbpjB2eBaiC8iB3fsh3w8vPKNSLWktz7+XgNsVcnVCXE7GfjWDP1e/yQ9f5RISCct/haWr7aScKYkoqJQtdYpeXVViK8CUT/z0fGE4C+aXpWPnVpBvRlvFS5XivZdfpH3vZ7mnvoAki6zfZKNJkwDRzvXohg1Vd+Ox7z8/EqnA0rUORNG4dBDumrjd87IugqII0WVKqvuWTksN85TSWbscxkyPwRXSBLs9nFOn/qbPw/+w+4AFQx7Giy89Y/ZmQQBNM0NYRQGXkzmzf+PHhf2Y+mkuC5fDrB9LEh7RhtbN76N21SQUVeP3VetYsGgs/Xpsp0M3OLINXh7RiOljvsXlcZ7PgZxOevcbRHLKDyya6sPvE7BbzneGdF9dQm27sIj5YIXjRyVa9CqO1yc8ePLkiTlFkcGdpCEEFBJrVg6GecrqrFoEw8Y25O3Bw2jUpCa4nOQcS+X5V1+mTaPvWb5+JpvW1sbtEMjN91IuLo5N27dxT8OGpBw5zZyfh/LK07n8580QJPkRXn/5CWpUr2AWA4PmFJbEKt1p06IRzw4aiEX+g7bdIK7EJtZt2EFoqETlcuVwetyg6wzu14smXZax+I9U2rYNQv755450bCGohQJesBos+tNB2hnptMetLyn0Ra+CO4oQh91IWrXRRp9+4SQnl+bj//uIqk3rcWTDRn5bvoJ8VaFB7frMXboVm2U/cxcuonGdKpxMSSEmOopN23fQqlUr/l6yCp9vDyMmJtC1wwc82K0VGHrBzMeCkSqbDXx+4svG8NVHoxjwRg8aN9hNwxp+9hzYT0y0k4OHDlGnRnXKJSaSVK0qrZs1Y+yMebRthdlWgZIIqMiCF0QBNc9g7hInVosxG3POfZFwR+UhStBfIzGhOn0e/5mpn31H1frVmDNpMv3feQ+/w0VM2fIcSD3Bzv0Sh09WpFnDmtSsU5tgUMFqtRIaEkJORgZ310qiTOnevPzsVzz4cGtQVfzZOUz6eiL9B79K38Gv8n/vvsee3bsBgYTKCTSu15OfF0HZMpCbn02xqGj2HTrMsRMnMReICDzdvQPrt7nYt1e6bJxEEn1g11m3ycY/u62azWZMuREZ3FEaoqhq1VpVkqjTuAb4/Wxds5bJc+fz9aTJxJY05xH0eKQHNWrWYtVvvxJTsiSRHg/3NmuK0+7g0c6dCPF48ERFMXrUR6Y2+PykpKby3BtvUaFqdR7v158QdwibNm/i5eEf8VS3LnR5pDvd2rfg1aEVEZbu4/7WYXh9Pnx+P3a7vWBaa4BGdWtRLKosi/78hwpVNXPa64UwYMZPLhRFWGmzGltvRAZ3EiEhgiBUrFy+PPjNSbbTZ8+h33MDzpEBcPjIERIT4vkuPY0WHbuyat5sKteqaTp3SeS194dRv0YNOnfuBIqCIcu8MewDHuj2ML0ee+xcO0mVKtHmvjY80esxyickULVOLT55ZwZ7Dh6lYZ0kUlLTKRYVQXypUuecuy0inGb16/D72u0M7MtFZgsrHNkvs2S1HYddH3ejQrhjCDEMI8HpcBSrUK4s6BpKTg7p2bk0atjw3DUH9u/np58WsCHDxdajmYSHuvGEuE2BGQboBkv+XEmI00VniwV0nfV//QUO50VkmG3tJbZ4MQa8MJDps+fwca2axMWXJC6xDAQChHhCQRRNLbug3tWkXg2WrrKSm+EnJPSCxT5WmPmLk4ws6aDHrf90o3K4Y3yIqmlVoiIipLjYWNA0NE0DQcBiOT9+unLtX6hxdan9cD/k8g1x2yx43G4z5AUQRYpHR+MLBMyio8XCP7t2U6du/Qt/hyWLfmLWLyto+PjbZGVm4lVUs8yiquDzmQSo6vmw9ywUlaTy8Xh9Tk6kiOe7swzZp0VmL3bhsBkTuHw50XXjziFEVavHlYolLDwcVAW7x4NNkjh48OC5a+5KLMsvq1ZzMO0AnvyDREcVwx0Scl5okkREWBgp6ennyh+qpmGxnDcEp08cY95fe6nUrjeZlbrw9byl6GoAwzDMfOZq0HWiIsKxyG7SzpjDuliACJj7m5PDJ+STFosx+mbkcCcRUiMpMdGs7OoGyDLtmjdlzJjz71e/UWM+fLg5+vzPOLh2KeXKJiI6HOcrubJMiWLRnEpONnu4plEhIZ4d27efayPM4+HgidN8sWwLicU0ctNO4HY4kC8k9kowDOw2G1arnexcwA0nT0oMf9/Oe2MEdC1P1zStOzfhCu4UQpwIQlKVihXO91Kfj06dOhJhlXn2P8/yz/ZtnDp9mvSMDLJOn8TjCaVyhcSLB5iAcnFxnEpJJZifD4pCk8aNOXX4EKvXmms3Q8IjGTWwJ40yl9Nc24Hb8NOhdZurl2HOQhAIBIKoaoBiUQZzv7Nzdzc3M3+uzkOdevNUj66lXU7nZEVRvuf65kBehjvCqRuGkeCw2UsmlS9v9mzzIIKmMeKdIXzz/feMHvEhQVUjLrYkTz/YlY1btlC7atXz/gNA16hUrhzpZ85wOjWVuPgEbE4nb77wHIOHvMWjjz/J/e3aUblKNR4VBEZ/8QUdWrWgSbMmZpn+WhBFUjLSMchl/CwnC363M6B3bwb1fxp3yZJgsdB90WIeHfBCF5/f31uSpCJHW3cEIZqmVYmOjJTKli51nhDzBAgCPXv2pGf37madqngxpoz+ElmWqF456VwZBDCdbmI5RFFk5959xFWoAHl5VK9Zk4kfDWfMlGn8vuhnQMAiCnS6rzUdHmgPgUsTiitAksg4c4bMLC/zl7r4cvgQHunZA4Btq9fw519/MaD/f+jesQNfTpveK8TlGk8R137dEYQoqlorvnQpwiMjL+7xYJqSswVEUYQzmcyc/xPNGzTAHR19vlQOZnW2RAnKlinDir/W0a7jA+Z9Ph9l4uIYMex9AllZBINBQsLDC4Z3fdf/oILA/iNHyPf6mfjxOzzS61Hw+/li3AR+XDCfRzt1AEmkQe2afDX9m/JAGJBZFFncEYRc5NDz8wu/yDDAbmfLho1s2bGDd1584XK7bxgIDgf3NWvKD7/8gpKVbYbNum5ql6Jgs9ux2e2mJipKUR+UuNhYPnz9VXr2fAwUhfc/+piFvy5m6ojhVGrYGDSdcE8osiQ7MSezFomQO8GpuxCEytWSKl097BQEEARGjv+a6pWTaNCgfuF2X1Ho2LoVJ04ns3b9BpPkC6HrBdOKbmAVaSBA29b38uKA/wCwavkKZs6dR4li0Xw0+RuSjxwFWcYfCKDpusIN5CO3nRDdMMo57Y6SlS906JfCMMDtZtmSpfz8+zLefmEAotVWuFCDQZLuuou7a9VkzLTp5jXXyi+KAkWBQBA9GGTCjJkMfLgz7/V5gqz0VHbs2g0OBwePHkXT1FSucy37hbjthGiaVq14dKRYtkzpKxPicnHq8GH6vvYGPTt3pHmLFmZGXRgMAySJV57ty5KVq1j62xJwuW7tQ1ss7N+7j9ysM9SsVIE9h4/iVTVqVq+GnpnJ/N+WYpHlNdzA2uHbToiiKHeXj0/AExlxuUMHcDk5dew4nZ54ipjoaD4Y8tb5MY0rweejcbOm9OjYgYHvvk9WSorpwG8VLBY279xJmMOO1SLx05q/6dOrF5EVKzJl2nT+2rQpaLfbP72Rpm87Iaqm1al+VxIUZoIcDnZs3UaLrg8iSxI/TByPJyzs+pyxpjH0tVfw+f18OWlKwVSgm4RhgNUKFplSMTG0b30vJctWYMR779P1ke6s/WUh730+Grvd/i7mpjVFxu2OsmJkSUqqWaXK5WULi4XkEyd48Jm+VEwsx/QvRxMaFmaaquvxCcEgkaVL89wTvZj8/Wxe7PM0TpercC28XlgtbNm8hZT0dNp07QyqZv6xW1m+cDH9Xn0dfyAwy2a1fnCjP3FbCdE0rVZEWJineqWKl/d6m41x06ZjsViYMXYM7tBQM6oqioNWFJrffTefTpxMckoqZcsn3hwhFit/rFnLsDFf8ua+/bRrfS9+v485Py9k2g+zUVV1mt1m62vcxO7Ut5WQoKLcVzuxHCViYy936LrOoWPHqVnlLtzFi0NWVtEaFwRwONh14ACyKBLidl+7eHgt+P282L8f67Zs4a0RI9UvJk+RNE3TvD7fHqfD8ZnVap10szuF304fYlNVtU2rxo0RzlZsL4Qg0KZ5M35dvoJ//loHbvd1FwBxOMDp5Nf5Cxj03lB6dO5EdKlCSC8qdB3RZqNE8eLY7bYFmqbVRhBqul2uWqIoTrq5xk3cNkIMwyhts9kS6tesUbgZ8fl4sHMnGtety4N9+3Fk//6rk2KxmOcliXXr/uaxp/vwUJ9n6db+foYMevnimtfNQNfRNA0BckVR3CIKwg7MSX63BLePEHBYZNkSHhpauCnRdSwWC5O++JS42Fg69nqSQ/v3mznFhaTY7eBykZKSwteTJnNPlwdp3/NxktPS+GHCOMZ8/BE2q+XmfEfh+FdkdzM+RNJ1vZGiqrV0XffYrNaDoij+yMWbsdgMw4gGFEEQUi68WQC/qqpqdk6OjHiFdwsECAsPY87kiXR98inu79GTxbO+Jb5C+XMC3rZ1GxO+ncHPS5YiiiJtW7Rg+Ouv0qBuHbBZzxcPBeHGyiWFoMBP/Cs7eN0oIffke70fuhyOeknly+N2Odm9bz9BRRkoCMLnAIIglAsqynxd0+J0w1A0TdvvsDsmS5I4oeD8UX8weHDl3+sr1m3apPDMWxDAFyA0PIy5UyfxwGO9eLTfc0wd8zmpaWl8/c0Mfvl9GRXLlWXIyy/SsfW9RBWMyeP3m/NzC2pgyLL5x+e7cWIKpqzme70Ioph7g7K7KoqudobxsKqqSzq2vrfegm+m8vt3M/jlh+/o3LYN+V7vuRVDPr//w7sqVKjyw8QJId+OHRPR7/Fe9R1223hN077HrIIG7VbrrBnzF3DmxAkz4SoMAuDzEVq8OPOnTEIQBRq1e4CHnnmWk8kpTPpkJCsXzOOp3k8QFRkJeXnnhW61smv/frr3688Dj/Vi2tTpBAvGWG4GBRpykyFb4Siyhnj9/nYtGjWUJ48dYx4IBEAQuLdJY6b+MKeqYRgC5oaRHQb1fYZm97UGv4/72t9Py0YNeXzgSw/puj5NFMVFFotl9OHjx3u/M/KTMl98/JE53lGYP7Fa2bR6DZ9MnEyXtm1pcHd9IlxOKpYvb/oQnw9yC9nLSVFIqloVj9vNhn/+Ib1RQ3Kys4mKirpxn6JpZGZnI4pi1o01cHUUWUN0w/C5nE5TeGfNjNVK8agoBIzQ3NzcL3Pz8kbEREdbmze4G3JzTdMRCOByOFBUNSgIwtkt8s64nc6nv533ozZuwsQrFgENXSc7P5/1mzeTnZNDg5b3UDGpkklefv6V8wu7ndNHjvLr8hW88dx/ePmN100tulEy7HaOHj3K7v0HsMry5htr5Oq4KiGGYdRVVPUdoOrZYzaL5e/te/biTU+H0FACisKfS5bw3JtvUaZMnPDUU0/3a9Wy5ROp6en8vHQZmq5BSAg4HcxdtJhAMLj1AkIQBGGpw25/5Z1PP2PJwkXmtZdA0DRa3N+Ohzu05/fVqyEjw1xnfjVfYLejBAL0fe11YkvE0KNbN0hPv8Hk0Fz8E/T7GTLqUzKzc3ZJkrT0Bhq69i9daX2IqmnDMIxXY6KjpRPJyWl2m60zsMPv93/uDwQeb1inNiVjYtiyfTsnTqfQqHFjPvv0U+LjzQ0MXn/jdcaPH0eFhATubd4MGZg6dx6KojwmiuKMSx8kEAxOCPN4npk/ZSJJVapcPDQLYLezaf0G7u3Rk3lfj6P5fa0h55LJ5Wedt8NB8rFj9Bv0Cpu372DxzG+oXKXKlUv2V4PdDqLI33+vZ/inn7N6w4YMl9PZDlh/Pbffkj0XVU0bYpHldz9++01atWrJ2+++z/e/LEyXRPFMo0aNKzzySA+W/bGMvLw8ateuTYt7WlC9evWLW85JYcuK35m9bgd/r1+P3+/j9KlT5OXlfeZwOAYbhnFR2iyANd/nW5xUvnyL+VMnERkVdfHkA0EAq5Wez/Zny86d/PbdDGLLlbvY/KgqyadOM3fhQkZ9NQ5PSAjfjP6CqjVrQF5+0bb2s9nAIrPrn+2MnjyZn35bij8YXOJyOAYB2695fwFuBSGVvD7fPyPfetP6RN9nwOdF9Qdo1e0hnOGRLPhx/kXTO6+I7DQ4uRsSa4A1BBBYv349Awb058CBA/PcbncPwzAune5RPCcvb1W75s3LTxs7GoskXVzusFpJTU2lS+9nOJWcTOf72xFXsiSCAOkZZ9i6ezdbd+xEEAQef7AbLz3bh9DIyKJphtUKViuH9+1j7JRpzP5lIdk5OetdTueHBXlWkXDThAQCwZFVKlV8edns784Pf0oSTe7vQOMG9fng09HgzQHnNVb8+vLg8DYoXxss58cijh8/To8e3dm9e/d0l8v1eCHFuBrZubnL+/d6LGz4e+9enDcUTHTIycxk3PRvWbZqNbn5+QiCgMvpJDEhjmb16tOiaWOzduUPXH/9ymIBu40TBw/x9bczmTHvR9IzM3e4HI6PJUmayQ1uVnvThKiq+npUZOTwn6dMIu6uyqBpvP/+MMZ8M4MVU8eSVDwE4qpB2DU24zy5H7KSoUQihEaDdD7C3r9/Hx07diAzM/M5i8Xy5aW3GobRKd/rnTfizdeFp/s8Y0ZqF0KWwW6DQBDN50NVFURBwOIOMU2N319EIuycPnyEr6Z/ww8LfiY5PW2/0+H4VJakqZjbcd4wboXJcvn8/hU1KleuM3TIWyz57Tc+GjuOiRMm0L1bF0g7aZqjUhXA7gKLvfCWvbnmKsqkBiBcHsz9+OM8+vbtk2Oz2e4SBOGyp1Y1bRCG8fG0zz7h3nZtLycFQBRRg0F2blzHmbQUYuPLUaFmnesjo4CI5KNHmThjFlN/mI0SDGDu9SDUAzZeu5Fr45Y4dQHKBILBGaqiNA4NC2f4Bx/w8EMPmycDXkg/ASf3Qc17LzJHFyHlCJw5DTFlwRMB0uV+p1u3rvzxx7K5Fqt1hWEYNSVJsllly1ADYw+cj7x+nDSBytWrFz5nS5TIz8lm618rKZVQjrhKVUC9SvG1wEecPHKEybO+Z8r3P4Cm8nCre6hZqTzvTpwezMrLryiJ4pHrkuA1cEu+jmDAMU3Tfm3YqFHjSZOmEB0dXXDCACUArjCwuyErBTxRIFsvMkmAefzEXnC4LyNDURQGDXqZ9Rs3EOrxdI0rXapruCuUkykpHE85Wc8iW+oBWXar9bmMzMxyfQa/1mL+1MlEFYu+fNqnruEKC6NWw6aIonTlpM9mA4uFowcO8vWMGXwzZx4yBl3vaUrru+sQHRbK8eRUNE03+JfKIteDK5VOLKqqdn/ssZ7nyQDTwbvDzX+HRsOuNWZvLB5/eQsOt3mNNwdki0laAfbs2cPMmTN4/5VBtGnZgtiSJdi7bT8nD6fx1NCXy+uG/qQoiJ8aEHQ5HI/s2LdvZf/X3qj4zbgvscry5SZJVXGc3dnBuECWgmDmEYLA3l27+XrGTL7/6RccsshDLZrQun4dIkJC8AUC+Px+FMlCnt+PKAi3ak/tIqPQTF3TtPJRUVFJDRo0KPyuvEzIyQBXKGQmn99x5xwM87wvD3LPXEQGQMaZDDxuF90faE98YiIWmx3JJlAlsSJNa9YnEAh2uqClVI/b/dCvf/6Z+db7w0zbX1i5/sLZiKJolmGsVjZs2MjTAwbSvOtDLF6yhMfbtuSr117i4Vb34LTZyMnLQ9d1EqvWJK5CEqqqyujqaxhGneuW4i1EoYSoqppYqlRpqWTJ2MLvcnrMXu8IMU2YcamGCwWmSjbJ8F9s+2VJQjcM8n0+cyRPUYiICMUb9NKweh00XUvk4k1et3nc7scnzPpOmTBx0uXTQ+Fc4khICIFgkEULF9H9mb50fvIptm7dzICHOjL21YF0atYIm9VCntdLIBggNCKS6g2bEl2hEoaugyBKhJQYDMYGdG0VhtGT83th/+so1GSpqtqkRIkSSNKlPb8AomRqhyvUdPIpR8ww2H6BDC02KFcDDmw2ybGfLxwWLx6DoumcSk4hNiEBfD7Cw0I5ti8FTdOwWi0hmJ+mO2c6BEH42Wa1jvhy2jdvPtalM86Y4hAImtogiRAIcPDAQX5etoz5i35lx969pwNBJatmUsWk4X2fwCpL+IMKuXn5GBi43CHEli1PbFwCgiyDEsRmtSDLMkaj5xEMFdaNa0zu6caoyktItg8QhF/4Fz6VdyEuJURWVXWEPxAY6PFcY+tZJWCGv1YHnNgD4YVsL6ipkJdl/q0EzkVkcXFxREVF88eaNdRtZg5OWR1OMrxnkFwCFtliGIZhCJeMW9is1nHJqWn9nh78akSv7g8T5fFwJjubnfv2sXbjJjZv265nZGVtsVmtaxw2a4aM0Va0WIirWJnUk8ewy1acLjeRMSWILhGLbHcUPJsCdjv5Ph+6EkASZbCHg7s4NOgPexbV4Ni671H9O5Ftb4Bww6tsr4VzhAiCEOrz+7+LLV68Tf0a1cktbHzhQlhsplbkZZlmyVqIVjs9ULaa6UdsjnOEWK1WunTuzNdTJtOnV0/CS5kLddp0ac8PM2fh9foCLqezsG0pTths1nZLV60etnTV6lqyLLtVVc1SVXWvJEk7bTbbaY/T7kbXWmEPrYE7BL/PR1SJUpROLI8eVBCt1vOb1ZwNj61W/Nk5DB31MWpEeeSIBNg4GaIrQvEqEB4PFe+DfUvu4tCfC5DkIQjS+zcm8qvjHCFBRRleKiamzXcTJ7Brxw5GTb2OmeOyFTyREFrMTARtjsscOO5wOLwdQqMuOty//3P8OP9Huj71DIOeew5ZFFi9fgM/LlqM3WbbwpX3CfnbYbe3MgwjBpBkSVIFu/1eoDeKrydhZZzYQiC+EYIjCmXH1yhBBUeIG1E2Lg+LbTZ0XeflN19nzc5DhHT5DPKSIX0/NBsMgRxTDlEVIKoiRCbC5unvoWtuROnV6xX09eIcIf5AoOOLfZ6mQt16ZKWnkZGWRvqZDKIio658t1EQTflz4fQBMwl0X7oJiAXCikNupkmOIILVTmRkJPPmzuOxnj3p/kwfxWa356uqFuZw2L+1SNKAa416C4KQDCShBUchWdqiq1CxLdTqCSc2QV4KgkPA580j15uPp0ypiwezZBlsNtKOH+e1/3ubectWEdJ2CEQkwB9DIaEpOMJBKaicqObIKEkPgNUJf419BUNPQRA/KbrYr4xzUZYoCL6jJ06AEqBuzZrYLRY2brxG9UAQTLPlCjdf9GyOciGsdkioBvlZkHHSjM4KkJBQloT4OGRZftthty8KcbtOypLUx7ieb5ob+kso3o2UqtOWEjXAGWWSYXWBIwyyTyBHlSVTCOWxZ5/mh2+/5cTJk3i9XnJzc9mzZw+jP/+cNl068eNfOwlpPxTim8A/BUXV8q1AuWS9jWFAMA/KtYAaj4AW/Ajzm1q3DOc0xOlwjPjqmxkT8r0+mjZtQkRoKAsWLKDNfW2u3kLAa5JytaUpit+MzJKPQMnyEPSD1c6BAwdYuXJlrsfj2avr+nvAM1y7mBeNFvwKydKVWo9DxTaw+FUoXQ8sTlC8Zi/3ZYLqx9J2KLv+nkK/t4cR5ZKIDAtFUVXSMrPJ1u3YKtyDu1pncMfAjnlwcjM0ebEgp7mCnio+qNwBMg7IHFk7HoujHrfoA00X1bIMw3gi3+vrJ4pCnMViEdwuV7Fly5ZTpkyZK7eQn23WtnLPQHxVcIcVfp1hwMGtplaVKAfOEAa/MpjlS377tX6tmvrshYuq2m228ly+x86FqIXi+xZPbBL1+0CZ+nB4Naz4ENoMh4iyoAXNgue+JXByEzR/zdSa7JNoGYfR8tIRRAkptARiZFlwRkLuadg+B3JOwd3PmqZKu8ZkRMkCeamw5G0I5A1BLNzJ39RHwQRBmOp2Oes7HY7KFlmunJ6evmTkyI+v3oIr1HTmZ3OTK0FXISQcUo+Cw86uPXuYMeNb9aW+z5Tbc/BQO1EUv+CqZBhdCXr/ILZWEq2GQIlqZk89tBwiy5qR0FkhKgFIbAVhcbDsfVPY2ceRQqKxlq6BJbYqos0Np7fC2jGwciRY3dB00PWRAeY1nlJQ6X7QAi/BrfkO1ZVqWWcA3G734FmzZjZt0aKFvVOnzoVfGSgYQNI1s251JVIkCxSLg5BwgicO0LdfP7q3v18oFhVZfsvOnXlup/O7Kz6loQ9EDXxCpXYCtXqZbWlB8GXDqa2mPZcsJunmDaAr5vHUXXB6G2QeBdVvnjtriWxuU6uSHgB3tOm4r4eMs9D8UO4eOLAsjPy0ZxHlIdd/c+G46rwsQRC2ybI8eNCgl0bHxpaibt26F19gGAVbGAVNLbmahpgNgjOU/wx8Ge+ZdD4cMlXq//qbAEuAwnVbV0dgGIOp1RPu6mwKWguCxQGntphlm9jalwvSMEwBRyeZuYRhFHyISjMJESWTRMMw71VuYBxK18AZAWWbw9YZTyHKI7mBbf0uxDXnZVks1jG5ubkf9+z5KH/8sezyC3IzClbJRpim4irw+Xw82ftJVv3xB3OmTiE3J5cVa9fhsNlmFnK5jK5MRJQH06AfVOkKWsG2S2D+fWQVxFQ1M2pdLaQJTPIUn6kdunpeO3T1/HHjJiZiq0GIawD2sJIYersbb8jEdUyUM7DbHa9kZmbO69WrJyNHfoz3go2GCY+BtBPgy73qwNCGDetp0aqFsX3zJn3hzG9IqF6NHxcvJu1MRnIhc5ws6MosLI6naDwQElua0dPZaq5kgeyTkLYP4hsXcWroVaKnG4GugqckFL8L1GCPm23uumYuGoaBzWYbahiGNvLjEbRq1YKJkyaSlp5uJnrFS0DZ6mYR8ZL71m/YwDN9n6Fjxw7UqlSBZXN/IDEpCTIymLf4NyyyvICL1dyNFpyL1d2NZq9B6foQvKSeJ1rg5AbTbMVUMXvp7YQgQqnaYOYkN/Xlz6LM7d1iGMb3ZePjenRu1ZIpE8YzcuRIatyVRL0qFSlZuSYedwiqppKWlsa27dvZuGEDp06e4O4a1flp2hTqNGlsfrszGGTi9G/ZuG0bdrt9wgW/YUVTvscZ2Q5npJlXXGZOBNN0Hf0LYmtdnE3fLmiKWVqxe8JQ/Y0Qij5d6CyKNNlaluXXDhw52upEcnKxSaM/Jz0lhbUbNrB1zwGWrv4bRTn7ZXqIi43lyS4dadW0KfGVkwhkZLB302Z2HjjAgsW/8tuKlVgtlkECnJ0j68DQpuKKbEezV0yt+Hu8WU+yeUxnDqa5yjwMWceg2sOFjMXcBhgauItBWBlI2dUC2frfIQQ4brfZOn/74/yJS1euTLq7dm2qVqrEfU0bY7fZyfd5sdusPPTAA+Z3OSwWMo8epdsjj7Jn/37OZGUTCAb9wBKnw/GlIAgX7vwchRrsROm7IbqS2eviG8Hf48z8QBBN4YsyHN9gkhRdsWhh6r8FwzCLqpHlIHl7PS7er7RIuNG9392aprUNBIMtNU2rgCAkSKIYH+oJoVJiIvPGf4XNaX77NDsri4XL/iAqJoaNGzfyydeTjjvt9rIUNvHM0J9Dto2mxZsQWd501n9PMEPUuk+ZYSzA4tdME9HgP6azvxNgsZtVg9WfZSHbKgBp8N/7fHeeJEmznQ7HsyFudwu71fp2XGws6xb8yPwpk7DZbGaZW9MIDQ2lx6M9aN2uLV3btsFutcYahlH90gYFCFVUvbY3KxVt/SSEs2Fq7cchNxn2Lga7B7KOQs4Js2xyM+Hq1SBZTE0sCnTNjLYsjjAMPfFGf/qWLFxUNS0uplgxoosXw3Lp54POruHIzqZMbCylS5YQFVWtf0kT1XLy8/+Miy35xKhhHxIVTCawaaYZTYkS1O8Lh1ZA8g5I3W2aq8jEf8lcCZBxELJPFDJ54yrQdTNJtHvA0Cve6K/fEkJ0XY8vHhVlltavtP5C03CEhXFXhQoEFaXxBfc+mp2bu7JFo4bVZ0/6msef7cMbL71McNuPGEf/MnuqMxJqPwmbpsPeX83oynzxW/H4F0AwtWPTNNi1AKQi7GNp6GZU6AjnZjTk/wEKK/Jt3analAAAAABJRU5ErkJggg=="

// responsive window resize.
window.addEventListener('load', (event) => {
    console.log('page has loaded');
    ctx.drawImage(png, 0, 0);
    drawImage();
});




