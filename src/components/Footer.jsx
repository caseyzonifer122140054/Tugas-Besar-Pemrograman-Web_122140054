import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-travelmate-blue">TravelMate</h3>
          <p className="text-sm text-muted-foreground">
            Rencanakan perjalanan Anda secara kolaboratif bersama teman dan keluarga.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-travelmate-blue">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="text-muted-foreground hover:text-travelmate-blue">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="text-muted-foreground hover:text-travelmate-blue">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="text-muted-foreground hover:text-travelmate-blue">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Fitur</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/trips" className="text-muted-foreground hover:text-travelmate-blue">
                Perencanaan Kolaboratif
              </Link>
            </li>
            <li>
              <Link to="/trips" className="text-muted-foreground hover:text-travelmate-blue">
                Itinerari Interaktif
              </Link>
            </li>
            <li>
              <Link to="/trips" className="text-muted-foreground hover:text-travelmate-blue">
                Pelacakan Anggaran
              </Link>
            </li>
            <li>
              <Link to="/trips" className="text-muted-foreground hover:text-travelmate-blue">
                Daftar Periksa Pintar
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-4">Perusahaan</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="#" className="text-muted-foreground hover:text-travelmate-blue">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link to="#" className="text-muted-foreground hover:text-travelmate-blue">
                Karir
              </Link>
            </li>
            <li>
              <Link to="#" className="text-muted-foreground hover:text-travelmate-blue">
                Blog
              </Link>
            </li>
            <li>
              <Link to="#" className="text-muted-foreground hover:text-travelmate-blue">
                Kontak
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-4">Bantuan</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="#" className="text-muted-foreground hover:text-travelmate-blue">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="#" className="text-muted-foreground hover:text-travelmate-blue">
                Kebijakan Privasi
              </Link>
            </li>
            <li>
              <Link to="#" className="text-muted-foreground hover:text-travelmate-blue">
                Syarat & Ketentuan
              </Link>
            </li>
            <li>
              <Link to="#" className="text-muted-foreground hover:text-travelmate-blue">
                Dukungan
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mt-8 pt-8 border-t">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} TravelMate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}