const Footer = () => {
  return (
    <footer className="py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} ILo e Tools. All rights reserved.</p>
        <p className="mt-1">Your one-stop solution for financial calculations.</p>
      </div>
    </footer>
  );
};

export default Footer;
