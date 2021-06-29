class Group < ApplicationRecord
	has_many :members
	has_many :users, through: :members
	has_many :issue_boards, dependent: :destroy

	validates :name, presence: true
	validates :logo, presence: false, allow_nil: true
end
