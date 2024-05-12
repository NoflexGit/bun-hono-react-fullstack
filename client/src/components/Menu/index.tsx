import { Link } from '@tanstack/react-router';

const Menu = () => {
  return (
    <div className="flex flex-col gap-4">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{' '}
      <Link to="/profile" className="[&.active]:font-bold">
        Profile
      </Link>{' '}
      <Link to="/create-expense" className="[&.active]:font-bold">
        Create Expense
      </Link>
    </div>
  );
};

export default Menu;
