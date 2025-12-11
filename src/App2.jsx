import React, { useState } from "react";
// import giraffeImage from './assets/images/giraffeImage.png';
import zeroImage from './assets/images/zeroImage.png';
import twoImage from './assets/images/twoImage.png';
import fourImage from './assets/images/fourImage.png';
import lotteryBg from './assets/images/lotteryBg.jpg';
import santa from './assets/images/santa.png';

// List of symbols used in reels
const symbols = [santa, twoImage, fourImage, zeroImage];

// Helper function to detect if a symbol is an image
const isImage = (symbol) => {
  return (
    typeof symbol === "string" &&
    (symbol.endsWith(".png") ||
     symbol.endsWith(".jpg") ||
     symbol.endsWith(".jpeg") ||
     symbol.startsWith("http"))
  );
};

// ------------------------
// Confetti Component
// ------------------------
const Confetti = () => {
  // Generate 200 confetti pieces with random properties
  const confettiPieces = Array.from({ length: 200 }, (_, i) => ({
    id: i,
    left: Math.random() * 100, // horizontal position
    animationDuration: 3 + Math.random() * 4, // 3-7 seconds falling speed
    color: ['#FFD700', '#FF1744', '#4CAF50', '#9C27B0', '#00BCD4'][Math.floor(Math.random() * 5)],
    rotation: Math.random() * 360, // rotation angle
    size: 8 + Math.random() * 8, // 8px to 16px square (thicker confetti)
  }));

  return (
    <div style={styles.confettiContainer}>
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          style={{
            ...styles.confettiPiece,
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            transform: `rotate(${piece.rotation}deg)`,
            animationDuration: `${piece.animationDuration}s`, // continuous fall
          }}
        />
      ))}
    </div>
  );
};

// ------------------------
// Reel Component
// ------------------------
const Reel = ({ spinning, result, delay }) => {
  // Render either image or text for the symbol
  const renderSymbol = (symbol) => {
    if (isImage(symbol)) {
      return (
        <img
          src={symbol}
          alt=""
          style={{ width: "70%", height: "70%", objectFit: "contain" }}
        />
      );
    }
    return <span style={{ color: "white", fontWeight: "900" }}>{symbol}</span>;
  };

  return (
    
    <div style={styles.reelContainer}>
      <div style={styles.reelBox}>
        {/* Reel strip that spins */}
        <div
          style={{
            ...styles.reelStrip,
            animation: spinning ? "spin 0.1s linear infinite" : "none",
            animationDelay: `${delay}ms`
          }}
        >
          {symbols.map((s, i) => (
            <div key={i} style={styles.symbol}>
              {renderSymbol(s)}
            </div>
          ))}
        </div>

        {/* Show final symbol when not spinning */}
        {!spinning && (
          <div style={styles.finalNumber}>
            {renderSymbol(result)}
          </div>
        )}
      </div>
    </div>
  );
};

// ------------------------
// Main App Component
// ------------------------
const App2 = () => {
  const [spinning, setSpinning] = useState([false, false, false]);
  const [results, setResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [credits, setCredits] = useState(1000);
  const [bet, setBet] = useState(100);
  const [lastWin, setLastWin] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // For displaying errors

  // Handle spinning logic
  // const play = () => {
  //   if (credits < bet) {
  //     alert("Not enough credits!");
  //     return;
  //   }

  // Updated play function
const play = () => {
  if (credits < bet) {
    setErrorMessage("❌ Not enough credits!");
    setTimeout(() => setErrorMessage(""), 3000); // Clear message after 3 sec
    return;
  }

    setIsPlaying(true);
    setLastWin(0);
    setShowConfetti(false);
    setCredits(prev => prev - bet);

    // Pick random symbols for reels
    const final = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    setResults(final);
    setSpinning([true, true, true]);

    // Gradually stop reels
    setTimeout(() => setSpinning([false, true, true]), 1500);
    setTimeout(() => setSpinning([false, false, true]), 2200);
    setTimeout(() => {
      setSpinning([false, false, false]);
      setIsPlaying(false);

      // Check for jackpot
      if (final[0] === fourImage && final[1] === zeroImage && final[2] === twoImage) {
        const winAmount = bet * 10;
        setCredits(prev => prev + winAmount);
        setLastWin(winAmount);
        setShowConfetti(true); // Confetti appears and stays
      }
    }, 3000);
  };

  // Determine if the player won
  const isWinner =
    results.length === 3 &&
    results[0] === fourImage &&
    results[1] === zeroImage &&
    results[2] === twoImage &&
    !spinning.includes(true);

  return (
    <div style={styles.page}>
      <div style={styles.backgroundLayer}></div>

      {/* Display confetti if winning */}
      {showConfetti && <Confetti />}

      {/* Header */}
      <div style={styles.headerSection}>
        <h2 style={styles.headerTitle}>Are You Ready To Be A Winner?</h2>
      </div>


<div style={styles.topButtons}>
  <button style={styles.walletButton}  onClick={() => alert("Connect Wallet!")}>
    Connect Wallet
  </button>
  <button style={styles.walletButton} onClick={() => alert("Withdraw!")}>
    Withdraw
  </button>
</div>

{errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}


      {/* Slot machine container */}
      <div style={styles.container}>
        <div style={styles.slotMachine}>

          {/* Top panel with credits, bet, wins */}
          <div style={styles.displayPanel}>
            <div style={styles.infoBox}>
              <div style={styles.infoLabel}>CREDITS</div>
              <div style={styles.infoValue}>{credits.toLocaleString()}</div>
            </div>
            <div style={styles.infoBox}>
              <div style={styles.infoLabel}>BET</div>
              {/* <div style={styles.infoValue}>{bet}</div> */}
             <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
  <input
    type="number"
    value={bet}
    onChange={(e) => {
      const value = Number(e.target.value);
      // Allow any number >= 0
      if (!isNaN(value) && value >= 0) {
        setBet(value);
      }
    }}
    style={styles.betInput}
    disabled={isPlaying}
  />
  <span style={{ color: "#FFD700", fontWeight: "bold" }}>Credits</span>
</div>


            </div>
            <div style={styles.infoBox}>
              <div style={styles.infoLabel}>WINS</div>
              <div style={{...styles.infoValue, color: lastWin > 0 ? '#FFD700' : '#FFF'}}>
                {lastWin.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 style={styles.title}>🎰 Take A Spin 🎰</h1>

          {/* Reels */}
          <div style={styles.reelsSection}>
            <div style={styles.reelsRow}>
              <Reel spinning={spinning[0]} result={results[0]} delay={0} />
              <Reel spinning={spinning[1]} result={results[1]} delay={50} />
              <Reel spinning={spinning[2]} result={results[2]} delay={100} />
            </div>
          </div>

          {/* Winner banner */}
          {isWinner && (
            <div style={styles.winnerBanner}>
              🎉 JACKPOT! YOU WIN {lastWin}! 🎉
            </div>
          )}

          {/* Control buttons */}
          <div style={styles.controlPanel}>
            <button
              onClick={() => setBet(Math.max(10, bet - 50))}
              style={{...styles.controlButton, ...styles.betButton}}
              disabled={isPlaying}
            >
              BET -
            </button>

            <button
              onClick={play}
              style={{...styles.spinButton, opacity: isPlaying ? 0.6 : 1}}
              disabled={isPlaying}
            >
              {isPlaying ? "SPINNING..." : "SPIN"}
            </button>

            <button
              onClick={() => setBet(Math.min(500, bet + 50))}
              style={{...styles.controlButton, ...styles.betButton}}
              disabled={isPlaying}
            >
              BET +
            </button>
          </div>

        </div>
      </div>

      {/* CSS animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: translateY(0px); }
            100% { transform: translateY(-${symbols.length * 110}px); }
          }

          @keyframes confettiFall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

// ------------------------
// Styles
// ------------------------
const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    // background: "#000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", 
  },

  headerSection: {
    padding: "5px 0",
  },

  headerTitle: {
    textAlign: "center",
    color: "#FFD700",
    fontSize: "clamp(1rem, 3vw, 1.6rem)",
    marginTop: "5px",
  },

  container: {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  slotMachine: {
    background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%)",
    borderRadius: "20px",
    padding: "15px",
    border: "4px solid #FFD700",
    width: "80%",
    maxWidth: "600px",
    maxHeight: "70vh",
    overflow: "hidden",
    textAlign: "center",
  },

  displayPanel: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "10px",
    gap: "10px",
    flexWrap: "wrap",
  },

  infoBox: {
    background: "#000",
    padding: "8px 12px",
    borderRadius: "10px",
    border: "2px solid #FFD700",
    textAlign: "center",
    minWidth: "70px",
  },

  infoLabel: {
    color: "#FFD700",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },

  infoValue: {
    color: "#FFF",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },

  title: {
    fontSize: "1.5rem",
    color: "#FFD700",
    marginBottom: "10px",
  },

  reelsSection: {
    background: "#000",
    padding: "10px",
    borderRadius: "15px",
    border: "3px solid #FFD700",
    marginBottom: "10px",
  },

  reelsRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },

  reelContainer: {
    position: "relative",
  },

  reelBox: {
    width: "clamp(60px, 15vw, 110px)",
    height: "clamp(60px, 15vw, 110px)",
    background: "#000",
    borderRadius: "10px",
    overflow: "hidden",
    border: "3px solid #FFD700",
  },

  reelStrip: {
    display: "flex",
    flexDirection: "column",
  },

  symbol: {
    width: "100%",
    height: "clamp(60px, 15vw, 110px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0a",
  },

  finalNumber: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  controlPanel: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },

  controlButton: {
    padding: "10px 15px",
    fontSize: "0.9rem",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
  },

  betButton: {
    background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
    color: "white",
  },

  spinButton: {
    padding: "12px 20px",
    fontSize: "1.2rem",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #FF1744 0%, #C51162 100%)",
    border: "3px solid #FFD700",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    minWidth: "clamp(90px, 20vw, 150px)",
  },

  winnerBanner: {
    margin: "10px 0",
    padding: "10px",
    fontSize: "1.2rem",
    color: "#FFD700",
    border: "2px solid #FFD700",
    borderRadius: "10px",
  },

  // Confetti styles
  confettiContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 9999,
    overflow: "hidden",
  },

  confettiPiece: {
    position: "absolute",
    top: "-20px",
    animation: "confettiFall linear infinite", // infinite animation
  },

  topButtons: {
  width: "80%",
  maxWidth: "600px",
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
  
},

walletButton: {
  padding: "10px 15px",
  fontSize: "0.9rem",
  borderRadius: "10px",
  // background: "linear-gradient(135deg, #2196F3 0%, #1E88E5 100%)",
  color: "#FFD700",
  fontWeight: "bold",
  cursor: "pointer",
  border: "2px solid #FFD700",
  
},

errorMessage: {
  color: "#FF1744",
  fontWeight: "bold",
  marginBottom: "10px",
  textAlign: "center",
},

betInput: {
  width: "80px",
  padding: "8px",
  borderRadius: "8px",
  border: "2px solid #FFD700",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "1rem",
},



backgroundLayer: {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: `linear-gradient(rgba(75, 12, 12, 0.23), rgba(0,0,0,0.6)), url(${lotteryBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  filter: "blur(8px)", // blur effect
  zIndex: -1, // behind everything
},


};

export default App2;
