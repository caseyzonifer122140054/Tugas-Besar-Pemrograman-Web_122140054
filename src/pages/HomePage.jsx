
import { Link } from "react-router-dom";
import { ArrowRight, Map, Calendar, Users, CheckSquare, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import { useEffect, useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";


const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }[] = [];

    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981'];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 1,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 3 - 1.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.3 }}
    />
  );
};

const features = [
  {
    icon: <Users className="h-8 w-8 text-travelmate-blue" />,
    title: "Perencanaan Kolaboratif",
    description: "Rencanakan perjalanan bersama teman dan keluarga secara real-time."
  },
  {
    icon: <Calendar className="h-8 w-8 text-travelmate-blue" />,
    title: "Itinerari Interaktif",
    description: "Buat dan atur aktivitas harian dengan antarmuka drag-and-drop kami."
  },
  {
    icon: <PieChart className="h-8 w-8 text-travelmate-blue" />,
    title: "Pelacakan Anggaran",
    description: "Pantau pengeluaran dan bagi biaya di antara peserta perjalanan."
  },
  {
    icon: <CheckSquare className="h-8 w-8 text-travelmate-blue" />,
    title: "Daftar Periksa Pintar",
    description: "Jangan pernah lupa barang penting dengan daftar packing yang dapat disesuaikan."
  },
  {
    icon: <Map className="h-8 w-8 text-travelmate-blue" />,
    title: "Integrasi Peta",
    description: "Visualisasikan tujuan Anda dan rencanakan rute secara efisien."
  }
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const HomePage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <ParallaxProvider>
        <div className="container mx-auto pb-16 overflow-hidden">
          {/* Particles Background */}
          <Particles />

          {/* Hero Section with Parallax */}
          <section className="py-20 px-6 relative min-h-[80vh] flex items-center">
            {/* Background Parallax Elements */}
            <div className="absolute inset-0 overflow-hidden -z-10">
              <Parallax translateY={['-10%', '10%']} className="absolute top-20 right-10 w-64 h-64 rounded-full bg-travelmate-blue/10 blur-3xl"></Parallax>
              <Parallax translateY={['5%', '-5%']} className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-travelmate-purple/10 blur-3xl"></Parallax>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="text-4xl md:text-6xl font-bold mb-6 text-travelmate-charcoal"
              >
                Perencanaan Perjalanan Jadi <span className="text-travelmate-blue">Mudah</span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 mb-10"
              >
                Rencanakan perjalanan Anda secara kolaboratif bersama teman dan keluarga.
                Buat itinerari, lacak pengeluaran, dan ciptakan kenangan bersama.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-travelmate-blue hover:bg-travelmate-blue/90 transition-transform hover:scale-105"
                >
                  <Link to="/trips">Mulai Sekarang <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="transition-transform hover:scale-105"
                >
                  <Link to="/login">Masuk / Daftar</Link>
                </Button>
              </motion.div>
            </div>
          </section>

          {/* Features Section with Animated Cards */}
          <section className="py-16 px-4 bg-gray-50 rounded-xl relative overflow-hidden">
            {/* Parallax background elements */}
            <Parallax translateY={['-5%', '5%']} className="absolute top-0 right-0 w-96 h-96 rounded-full bg-travelmate-blue/5 blur-3xl -z-10"></Parallax>
            <Parallax translateY={['10%', '-10%']} className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-travelmate-purple/5 blur-3xl -z-10"></Parallax>

            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeIn}
                className="text-3xl font-bold text-center mb-12 text-travelmate-charcoal"
              >
                Semua yang Anda butuhkan untuk <span className="text-travelmate-blue">perjalanan sempurna</span>
              </motion.h2>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {features.map((feature, index) => (
                  <motion.div key={index} variants={fadeIn}>
                    <Card className="shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2">
                      <CardHeader>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          viewport={{ once: true }}
                          className="mb-4"
                        >
                          {feature.icon}
                        </motion.div>
                        <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* CTA Section with Parallax and Animation */}
          <section className="py-20 px-4 text-center relative">
            <Parallax translateY={['-15%', '15%']} className="absolute inset-0 -z-10">
              <div
                className="w-full h-full bg-gradient-to-br from-travelmate-purple/20 to-travelmate-blue/10 opacity-70"
                style={{
                  transform: `perspective(1000px) rotateX(${scrollY * 0.02}deg)`
                }}
              ></div>
            </Parallax>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              className="max-w-4xl mx-auto bg-travelmate-purple p-10 rounded-2xl shadow-lg relative z-10 backdrop-blur-sm"
              style={{
                background: "rgba(var(--travelmate-purple-rgb), 0.9)",
              }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-6 text-travelmate-charcoal"
              >
                Siap untuk merencanakan petualangan berikutnya?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-xl mb-8 text-gray-700"
              >
                Bergabunglah dengan TravelMate hari ini dan jadikan pengalaman perencanaan perjalanan Anda bebas stres dan menyenangkan.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-travelmate-blue hover:bg-travelmate-blue/90 transition-all duration-300"
                >
                  <Link to="/trips">
                    Mulai Merencanakan Sekarang
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </section>
        </div>
      </ParallaxProvider>
      <Footer />
    </>
  );
};

export default HomePage;
