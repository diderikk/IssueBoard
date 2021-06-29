class User < ApplicationRecord
  has_and_belongs_to_many :issue_boards
	has_many :members
	has_many :groups, through: :members

  has_secure_password

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: /\A[A-Za-z0-9+_.-]+@(.+)\z/, message: "not valid email"}
  validates :password, presence: true, length: { minimum: 6 }, allow_nil: true
end
